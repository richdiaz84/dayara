
    import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate, useLocation } from 'react-router-dom';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [userRole, setUserRole] = useState(null);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      const navigate = useNavigate();
      const location = useLocation();

      const getAppBaseUrl = () => {
        return window.location.origin;
      };

      const fetchUserRole = useCallback(async (userId) => {
        if (!userId) {
            setUserRole(null);
            return null;
        }
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          const role = data ? data.role : 'cliente';
          setUserRole(role);
          return role;
        } catch (error) {
          console.error('Error fetching user role:', error.message);
          setUserRole('cliente');
          return 'cliente';
        }
      }, []);

      useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const handleAuthFlow = async (authChangeEvent, session) => {
          if (!isMounted) return;

          const currentUser = session?.user || null;
          setUser(currentUser);

          if (currentUser) {
            let role = await fetchUserRole(currentUser.id);

            if (authChangeEvent === 'SIGNED_IN' && currentUser.app_metadata?.provider && currentUser.app_metadata.provider !== 'email') {
              const { data: existingRoleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', currentUser.id)
                .maybeSingle();
              if (!existingRoleData) {
                const { error: insertError } = await supabase.from('user_roles').insert({ user_id: currentUser.id, role: 'cliente' });
                if (!insertError) role = 'cliente';
              }
            }
            setUserRole(role);

            if (authChangeEvent === "SIGNED_IN") {
                const redirectPath = new URLSearchParams(location.search).get('redirect') || (role === 'admin' || role === 'agente' ? '/admin' : '/');
                navigate(redirectPath, { replace: true });
            }
          } else {
            setUserRole(null);
          }
          if (isMounted) setLoading(false);
        };
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthFlow('INITIAL_SESSION', session);
        }).catch(error => {
             console.error("Error in initial getSession:", error);
             if (isMounted) setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((authChangeEvent, session) => {
            handleAuthFlow(authChangeEvent, session);
        });

        return () => {
          isMounted = false;
          authListener?.subscription?.unsubscribe();
        };
      }, [fetchUserRole, navigate, location.search]);


      const signUp = async (email, password, fullName) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${getAppBaseUrl()}/`,
          },
        });

        if (error) {
          toast({ title: "Error de Registro", description: error.message, variant: "destructive" });
          setLoading(false);
        } else if (data.user) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: data.user.id, role: 'cliente' });
          if (roleError) {
            console.error('Error setting default role:', roleError);
            toast({ title: "Error de Registro", description: "No se pudo asignar el rol de usuario.", variant: "destructive" });
          } else {
            toast({ title: "Registro Exitoso", description: "¡Bienvenido/a! Revisa tu correo para confirmar tu cuenta." });
          }
        }
        return { user: data.user, error };
      };

      const signIn = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Error de Inicio de Sesión", description: error.message, variant: "destructive" });
          setLoading(false); 
        } else if (data.user) {
          toast({ title: "Inicio de Sesión Exitoso", description: `¡Bienvenido/a de nuevo, ${data.user.user_metadata?.full_name || data.user.email}!` });
        }
        return { user: data.user, error };
      };
      
      const signInWithGoogle = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${getAppBaseUrl()}/` },
        });
        if (error) {
          toast({ title: "Error con Google", description: error.message, variant: "destructive" });
          setLoading(false);
        }
      };

      const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null); 
        setUserRole(null); 
        toast({ title: "Sesión Cerrada", description: "Has cerrado sesión exitosamente." });
        navigate('/'); 
        setLoading(false);
      };

      const updateUserMetadata = async (metadata) => {
        setLoading(true);
        const { data, error } = await supabase.auth.updateUser(metadata);
        if (error) {
          toast({ title: "Error al Actualizar Perfil", description: error.message, variant: "destructive" });
        } else if (data.user) {
          setUser(data.user); 
          toast({ title: "Perfil Actualizado", description: "Tu información ha sido actualizada." });
        }
        setLoading(false);
        return { user: data.user, error };
      };
      
      const sendPasswordResetEmail = async (email) => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${getAppBaseUrl()}/auth?reset=true`,
        });
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Correo Enviado", description: "Si la cuenta existe, recibirás un correo para restablecer tu contraseña." });
        }
        setLoading(false);
      };

      const value = {
        user,
        userRole,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateUserMetadata,
        sendPasswordResetEmail,
        fetchUserRole, 
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
  