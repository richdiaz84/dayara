
    import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';

    const LoyaltyContext = createContext({
      loyaltyData: null,
      loadingLoyalty: true,
      fetchLoyaltyData: async () => {},
      addLoyaltyPoints: async () => {},
      loyaltyTiers: [],
    });

    export const useLoyalty = () => useContext(LoyaltyContext);

    export const LoyaltyProvider = ({ children }) => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [loyaltyData, setLoyaltyData] = useState(null);
      const [loyaltyTiers, setLoyaltyTiers] = useState([]);
      const [loadingLoyalty, setLoadingLoyalty] = useState(true);

      const fetchLoyaltyTiers = useCallback(async () => {
        try {
          const { data, error } = await supabase
            .from('loyalty_tiers')
            .select('*')
            .order('min_points', { ascending: true });
          if (error) throw error;
          setLoyaltyTiers(data || []);
        } catch (error) {
          console.error("Error fetching loyalty tiers:", error);
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los niveles de lealtad." });
        }
      }, [toast]);
      
      const fetchLoyaltyData = useCallback(async (userId) => {
        if (!userId) {
          setLoyaltyData(null);
          setLoadingLoyalty(false);
          return;
        }
        setLoadingLoyalty(true);
        try {
          const { data, error } = await supabase
            .from('loyalty_points')
            .select(`
              points,
              current_tier_id,
              loyalty_tiers (id, name, min_points, discount_percentage, benefits)
            `)
            .eq('user_id', userId)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
             throw error;
          }
          
          if (data) {
            setLoyaltyData(data);
          } else {
            // If no loyalty record, create one with 0 points
            const { data: newLoyaltyData, error: creationError } = await supabase
              .from('loyalty_points')
              .insert({ user_id: userId, points: 0, current_tier_id: null })
              .select(`
                points,
                current_tier_id,
                loyalty_tiers (id, name, min_points, discount_percentage, benefits)
              `)
              .single();
            if (creationError) throw creationError;
            setLoyaltyData(newLoyaltyData);
          }

        } catch (error) {
          console.error("Error fetching loyalty data:", error);
          toast({ variant: "destructive", title: "Error de Lealtad", description: "No se pudieron cargar tus datos de lealtad." });
          setLoyaltyData(null);
        } finally {
          setLoadingLoyalty(false);
        }
      }, [toast]);

      const addLoyaltyPoints = useCallback(async (userId, pointsToAdd, orderId = null) => {
        if (!userId || pointsToAdd <= 0) return;
        try {
          // Fetch current points
          let { data: currentData, error: fetchError } = await supabase
            .from('loyalty_points')
            .select('points, current_tier_id')
            .eq('user_id', userId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

          const currentPoints = currentData ? currentData.points : 0;
          const newTotalPoints = currentPoints + pointsToAdd;

          // Determine new tier
          let newTierId = currentData ? currentData.current_tier_id : null;
          if (loyaltyTiers.length > 0) {
            const applicableTiers = loyaltyTiers.filter(tier => newTotalPoints >= tier.min_points);
            if (applicableTiers.length > 0) {
              newTierId = applicableTiers.sort((a,b) => b.min_points - a.min_points)[0].id;
            }
          }
          
          if (currentData) { // Record exists, update it
            const { error: updateError } = await supabase
              .from('loyalty_points')
              .update({ points: newTotalPoints, current_tier_id: newTierId, last_updated_at: new Date().toISOString() })
              .eq('user_id', userId);
            if (updateError) throw updateError;
          } else { // No record, insert new one
             const { error: insertError } = await supabase
              .from('loyalty_points')
              .insert({ user_id: userId, points: newTotalPoints, current_tier_id: newTierId, last_updated_at: new Date().toISOString() });
            if (insertError) throw insertError;
          }
          
          // Log transaction (optional, if you have a loyalty_transactions table)
          // await supabase.from('loyalty_transactions').insert({ user_id: userId, points_change: pointsToAdd, reason: 'order_purchase', order_id: orderId });

          toast({ title: "¡Puntos Añadidos!", description: `Has ganado ${pointsToAdd} puntos de lealtad.` });
          fetchLoyaltyData(userId); // Refresh data
        } catch (error) {
          console.error("Error adding loyalty points:", error);
          toast({ variant: "destructive", title: "Error de Puntos", description: "No se pudieron añadir tus puntos de lealtad." });
        }
      }, [toast, fetchLoyaltyData, loyaltyTiers]);

      useEffect(() => {
        fetchLoyaltyTiers();
      }, [fetchLoyaltyTiers]);
      
      useEffect(() => {
        if (user?.id) {
          fetchLoyaltyData(user.id);
        } else {
          setLoyaltyData(null);
          setLoadingLoyalty(false);
        }
      }, [user, fetchLoyaltyData]);

      return (
        <LoyaltyContext.Provider value={{ loyaltyData, loadingLoyalty, fetchLoyaltyData, addLoyaltyPoints, loyaltyTiers }}>
          {children}
        </LoyaltyContext.Provider>
      );
    };
  