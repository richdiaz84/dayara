
    import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, User, Mail, Phone, MapPin, Edit3, Shield } from 'lucide-react';
    import { motion } from 'framer-motion';

    const AccountProfilePage = () => {
      const { user, session, loading: authLoading } = useAuth();
      const { toast } = useToast();
      const [loading, setLoading] = useState(false);
      const [isEditing, setIsEditing] = useState(false);

      const [profileData, setProfileData] = useState({
        email: '',
        full_name: '',
        phone: '',
        address_street: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: '',
      });

      const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      const [isPasswordEditing, setIsPasswordEditing] = useState(false);
      const [passwordLoading, setPasswordLoading] = useState(false);

      useEffect(() => {
        if (user) {
          setProfileData({
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            phone: user.user_metadata?.phone || '',
            address_street: user.user_metadata?.address_street || '',
            address_city: user.user_metadata?.address_city || '',
            address_state: user.user_metadata?.address_state || '',
            address_zip: user.user_metadata?.address_zip || '',
            address_country: user.user_metadata?.address_country || 'México',
          });
        }
      }, [user]);

      const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
      };

      const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
      };

      const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const updates = {
            data: { 
              full_name: profileData.full_name,
              phone: profileData.phone,
              address_street: profileData.address_street,
              address_city: profileData.address_city,
              address_state: profileData.address_state,
              address_zip: profileData.address_zip,
              address_country: profileData.address_country,
            },
          };
          
          // Handle email change separately if it has changed
          if (profileData.email !== user.email) {
            updates.email = profileData.email;
          }

          const { error } = await supabase.auth.updateUser(updates);
          if (error) throw error;
          
          toast({ title: "Perfil Actualizado", description: "Tu información de perfil ha sido guardada." });
          setIsEditing(false);
        } catch (error) {
          toast({ variant: "destructive", title: "Error al Actualizar", description: error.message });
        } finally {
          setLoading(false);
        }
      };

      const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
          toast({ variant: "destructive", title: "Error", description: "Las nuevas contraseñas no coinciden." });
          return;
        }
        if (passwordData.newPassword.length < 6) {
          toast({ variant: "destructive", title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres." });
          return;
        }
        setPasswordLoading(true);
        try {
          // Re-authenticate first if currentPassword is provided (for non-OAuth users)
          // This step might be skippable if the session is fresh, but it's safer.
          // For simplicity, we'll directly try to update. Supabase handles re-auth if needed for email/pass users.
          
          const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
          if (error) {
            // Check if error is due to needing re-authentication
            if (error.message.includes("re-authenticate")) {
               toast({ variant: "destructive", title: "Reautenticación Requerida", description: "Por favor, vuelve a iniciar sesión para cambiar tu contraseña." });
            } else {
              throw error;
            }
          } else {
            toast({ title: "Contraseña Actualizada", description: "Tu contraseña ha sido cambiada exitosamente." });
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            setIsPasswordEditing(false);
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Error al Cambiar Contraseña", description: error.message });
        } finally {
          setPasswordLoading(false);
        }
      };
      
      if (authLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
      }

      return (
        <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5 }} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl flex items-center"><User className="mr-3 text-primary"/>Información Personal</CardTitle>
                  <CardDescription>Administra tus datos personales y de contacto.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit3 className="mr-2 h-4 w-4"/>{isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-4 text-sm">
                  <p><strong className="font-medium text-foreground">Nombre:</strong> <span className="text-muted-foreground">{profileData.full_name || 'No especificado'}</span></p>
                  <p><strong className="font-medium text-foreground">Email:</strong> <span className="text-muted-foreground">{profileData.email}</span></p>
                  <p><strong className="font-medium text-foreground">Teléfono:</strong> <span className="text-muted-foreground">{profileData.phone || 'No especificado'}</span></p>
                  <div>
                    <strong className="font-medium text-foreground block mb-1">Dirección:</strong>
                    <address className="not-italic text-muted-foreground pl-4 border-l-2 border-primary/30">
                      {profileData.address_street || 'Calle no especificada'}<br />
                      {profileData.address_city || 'Ciudad no especificada'}, {profileData.address_state || 'Estado no especificado'} {profileData.address_zip || 'CP no especificado'}<br />
                      {profileData.address_country || 'País no especificado'}
                    </address>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Nombre Completo</Label>
                      <Input id="full_name" name="full_name" value={profileData.full_name} onChange={handleProfileChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <fieldset className="space-y-2 border p-4 rounded-md">
                      <legend className="text-sm font-medium px-1">Dirección</legend>
                      <div>
                          <Label htmlFor="address_street">Calle y Número</Label>
                          <Input id="address_street" name="address_street" value={profileData.address_street} onChange={handleProfileChange} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <Label htmlFor="address_city">Ciudad</Label>
                              <Input id="address_city" name="address_city" value={profileData.address_city} onChange={handleProfileChange} />
                          </div>
                          <div>
                              <Label htmlFor="address_state">Estado/Provincia</Label>
                              <Input id="address_state" name="address_state" value={profileData.address_state} onChange={handleProfileChange} />
                          </div>
                          <div>
                              <Label htmlFor="address_zip">Código Postal</Label>
                              <Input id="address_zip" name="address_zip" value={profileData.address_zip} onChange={handleProfileChange} />
                          </div>
                          <div>
                              <Label htmlFor="address_country">País</Label>
                              <Input id="address_country" name="address_country" value={profileData.address_country} onChange={handleProfileChange} />
                          </div>
                      </div>
                  </fieldset>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Cambios
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl flex items-center"><Shield className="mr-3 text-primary"/>Seguridad de la Cuenta</CardTitle>
                  <CardDescription>Administra tu contraseña.</CardDescription>
                </div>
                { user && session?.user?.app_metadata?.provider !== 'google' && session?.user?.app_metadata?.provider !== 'facebook' && (
                    <Button variant="outline" size="sm" onClick={() => setIsPasswordEditing(!isPasswordEditing)}>
                        <Edit3 className="mr-2 h-4 w-4"/>{isPasswordEditing ? 'Cancelar' : 'Cambiar Contraseña'}
                    </Button>
                )}
              </div>
            </CardHeader>
            { user && session?.user?.app_metadata?.provider !== 'google' && session?.user?.app_metadata?.provider !== 'facebook' && isPasswordEditing && (
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                   <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
                  </div>
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cambiar Contraseña
                  </Button>
                </form>
              </CardContent>
            )}
             { user && (session?.user?.app_metadata?.provider === 'google' || session?.user?.app_metadata?.provider === 'facebook') && (
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Has iniciado sesión con {session.user.app_metadata.provider}. Para cambiar tu contraseña, por favor hazlo directamente en tu cuenta de {session.user.app_metadata.provider}.
                    </p>
                </CardContent>
            )}
          </Card>
        </motion.div>
      );
    };
    export default AccountProfilePage;
  