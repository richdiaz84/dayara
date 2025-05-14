
    import React, { useEffect, useState } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { supabase } from '@/lib/supabaseClient';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress'; 
    import { Loader2, Star, Award, Gift, Percent, Zap } from 'lucide-react';
    import { motion } from 'framer-motion';

    const AccountLoyaltyPage = () => {
      const { user } = useAuth();
      const [loyaltyData, setLoyaltyData] = useState(null);
      const [allTiers, setAllTiers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchLoyaltyData = async () => {
          if (!user) {
            setLoading(false);
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const { data: tiersData, error: tiersError } = await supabase
              .from('loyalty_tiers')
              .select('*')
              .order('min_points', { ascending: true });
            if (tiersError) throw tiersError;
            setAllTiers(tiersData || []);

            const { data: pointsData, error: pointsError } = await supabase
              .from('loyalty_points')
              .select(`
                points,
                current_tier_id,
                loyalty_tiers (
                  name,
                  min_points,
                  discount_percentage,
                  benefits
                )
              `)
              .eq('user_id', user.id)
              .single();
            
            if (pointsError && pointsError.code !== 'PGRST116') { // PGRST116: no rows found
               throw pointsError;
            }
            
            if (pointsData) {
              setLoyaltyData(pointsData);
            } else { // User has no points record yet, assign base tier
              const baseTier = tiersData.find(t => t.min_points === 0) || tiersData[0];
              setLoyaltyData({
                points: 0,
                loyalty_tiers: baseTier || null,
                current_tier_id: baseTier ? baseTier.id : null
              });
            }

          } catch (err) {
            console.error("Error fetching loyalty data:", err);
            setError(err.message || "No se pudo cargar tu información de lealtad.");
          } finally {
            setLoading(false);
          }
        };

        fetchLoyaltyData();
      }, [user]);

      if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
      }

      if (error) {
        return <p className="text-red-500">Error: {error}</p>;
      }
      
      if (!user) {
         return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><Award className="mr-3 text-primary"/>Programa de Lealtad</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Por favor, inicia sesión para ver tu estado en el programa de lealtad.</p>
            </CardContent>
          </Card>
         );
      }

      if (!loyaltyData || !allTiers.length) {
        return (
          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Award className="mr-3 text-primary"/>Programa de Lealtad</CardTitle>
              </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Aún no eres parte de nuestro programa de lealtad o no hay niveles configurados. ¡Realiza una compra para empezar a ganar puntos!</p>
            </CardContent>
          </Card>
        );
      }
      
      const currentTier = loyaltyData.loyalty_tiers;
      const nextTier = allTiers.find(tier => currentTier && tier.min_points > currentTier.min_points);
      const pointsToNextTier = nextTier ? nextTier.min_points - loyaltyData.points : 0;
      const progressPercentage = nextTier && currentTier ? Math.min(100, (loyaltyData.points - currentTier.min_points) / (nextTier.min_points - currentTier.min_points) * 100) : (currentTier ? 100 : 0);


      return (
        <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl flex items-center"><Award className="mr-3"/>Programa de Lealtad</CardTitle>
                {currentTier && <span className="text-lg font-semibold px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full flex items-center"><Star className="h-4 w-4 mr-1.5"/>{currentTier.name}</span>}
              </div>
              <CardDescription className="text-primary-foreground/80 mt-1">
                ¡Gracias por ser un cliente valioso! Aquí puedes ver tus puntos y beneficios.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Puntos Acumulados</p>
                <p className="text-5xl font-bold text-primary">{loyaltyData.points}</p>
              </div>

              {currentTier && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground">Beneficios de tu Nivel ({currentTier.name}):</h3>
                  {currentTier.discount_percentage > 0 && (
                    <p className="flex items-center text-sm"><Percent className="h-4 w-4 mr-2 text-green-500"/>{currentTier.discount_percentage}% de descuento en todas tus compras.</p>
                  )}
                  {currentTier.benefits && currentTier.benefits.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                      {currentTier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center"><Gift className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0"/>{benefit}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No hay beneficios adicionales para este nivel actualmente.</p>
                  )}
                </motion.div>
              )}

              {nextTier && currentTier && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} className="space-y-2">
                  <div className="flex justify-between items-baseline text-sm mb-1">
                    <p className="text-muted-foreground">Próximo Nivel: <strong className="text-foreground">{nextTier.name}</strong></p>
                    <p className="text-primary font-semibold">{pointsToNextTier > 0 ? `${pointsToNextTier} puntos restantes` : "¡Ya casi!"}</p>
                  </div>
                  <Progress value={progressPercentage} className="w-full h-3 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-yellow-500" />
                  <p className="text-xs text-muted-foreground text-right">Necesitas {nextTier.min_points} puntos para el nivel {nextTier.name}.</p>
                </motion.div>
              )}
              {!nextTier && currentTier && (
                 <p className="text-center text-lg font-semibold text-green-600 flex items-center justify-center"><Zap className="h-5 w-5 mr-2 text-yellow-500"/>¡Felicidades! Has alcanzado el nivel más alto.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AccountLoyaltyPage;
  