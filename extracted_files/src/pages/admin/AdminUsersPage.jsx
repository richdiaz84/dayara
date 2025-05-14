
    import React, { useState, useMemo, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card } from '@/components/ui/card';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
    } from "@/components/ui/dialog";
    import { Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import AdminUserForm from '@/components/admin/AdminUserForm';
    import UserList from '@/components/admin/users/UserList';
    import UserActions from '@/components/admin/users/UserActions';
    import { supabase } from '@/lib/supabaseClient';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";


    const AdminUsersPage = () => {
      const [users, setUsers] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedUser, setSelectedUser] = useState(null);
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
      const [userToDelete, setUserToDelete] = useState(null);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      
      const initialFormData = {
        id: '', name: '', email: '', role: 'cliente', password: '', status: 'activo'
      };
      const [formData, setFormData] = useState(initialFormData);

      const fetchUsers = useCallback(async (currentSearchTerm = searchTerm) => {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_all_users_with_metadata', {
            search_term: currentSearchTerm || null
        });

        if (error) {
          toast({ title: "Error al cargar usuarios", description: error.message, variant: "destructive" });
          setUsers([]); 
        } else {
           const formattedUsers = data.map(u => ({
            id: u.id,
            name: u.full_name || u.email, 
            full_name: u.full_name,
            email: u.email,
            role: u.role || 'cliente', 
            status: u.status || 'activo', 
            created_at: u.created_at,
            avatar_url: u.avatar_url,
            totalSpent: parseFloat(u.total_spent) || 0,
          }));
          setUsers(formattedUsers);
        }
        setLoading(false);
      }, [searchTerm, toast]);

      const debouncedFetchUsers = useCallback(
        debounce((term) => fetchUsers(term), 500),
        [fetchUsers]
      );

      useEffect(() => {
        debouncedFetchUsers(searchTerm);
        return () => {
          debouncedFetchUsers.cancel && debouncedFetchUsers.cancel();
        };
      }, [searchTerm, debouncedFetchUsers]);


      const openNewUserForm = () => {
        setSelectedUser(null);
        setFormData({...initialFormData}); 
        setIsFormOpen(true);
      };

      const openEditUserForm = (user) => {
        setSelectedUser(user);
        const userDataForForm = {
          ...initialFormData, 
          id: user.id,
          name: user.full_name || user.name || '',
          email: user.email || '',
          role: user.role || 'cliente',
          status: user.status || 'activo',
          password: '', 
        };
        setFormData(userDataForForm);
        setIsFormOpen(true);
      };

      const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (selectedUser && selectedUser.id) { 
          const updates = {
            email: formData.email,
            data: { 
              full_name: formData.name,
              role: formData.role,
              status: formData.status,
            }
          };
          if (formData.password) {
            updates.password = formData.password;
          }

          const { data, error } = await supabase.auth.admin.updateUserById(selectedUser.id, updates);
          
          setLoading(false);
          if (error) {
            toast({ title: "Error al actualizar usuario", description: error.message, variant: "destructive" });
          } else {
            toast({ title: "Usuario Actualizado", description: `${formData.name} ha sido actualizado.` });
            setIsFormOpen(false);
            fetchUsers(searchTerm);
          }
        } else { 
          const { data, error } = await supabase.auth.admin.createUser({
            email: formData.email,
            password: formData.password,
            email_confirm: true, 
            user_metadata: {
              full_name: formData.name,
              role: formData.role,
              status: formData.status,
            }
          });
          setLoading(false);
          if (error) {
            toast({ title: "Error al crear usuario", description: error.message, variant: "destructive" });
          } else {
            toast({ title: "Usuario Creado", description: `${formData.name} ha sido creado.` });
            setIsFormOpen(false);
            fetchUsers(searchTerm);
          }
        }
      };

      const handleDeleteUser = async () => {
        if (!userToDelete || !userToDelete.id) {
            toast({ title: "Error", description: "ID de usuario inválido.", variant: "destructive" });
            setIsDeleteConfirmOpen(false);
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.admin.deleteUser(userToDelete.id);
        setLoading(false);

        if (error) {
          toast({ title: "Error al eliminar usuario", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Usuario Eliminado", description: `${userToDelete.name || userToDelete.email} ha sido eliminado.` });
          fetchUsers(searchTerm);
        }
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      };

      const openDeleteConfirm = (user) => {
        setUserToDelete(user);
        setIsDeleteConfirmOpen(true);
      };

      const roles = ['cliente', 'agente', 'admin'];
      const statuses = ['activo', 'inactivo', 'suspendido'];

      function debounce(func, wait) {
        let timeout;
        const debouncedFunction = function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
        debouncedFunction.cancel = () => {
            clearTimeout(timeout);
        };
        return debouncedFunction;
      }

      if (loading && users.length === 0 && !searchTerm) {
        return (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 p-4 md:p-6"
        >
          <UserActions
            onAddUser={openNewUserForm}
            onRefreshUsers={() => fetchUsers(searchTerm)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={loading && !!searchTerm}
          />

          <Card className="bg-card shadow-md">
            {loading && users.length === 0 && searchTerm ? (
              <div className="p-4 text-center text-muted-foreground">Buscando usuarios...</div>
            ) : (
              <UserList users={users} onEdit={openEditUserForm} onDelete={openDeleteConfirm} />
            )}
          </Card>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-lg bg-card">
              <DialogHeader>
                <DialogTitle className="text-primary">{selectedUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
                <DialogDescription>
                  {selectedUser ? 'Modifica los detalles de este usuario.' : 'Completa la información para agregar un nuevo usuario.'}
                </DialogDescription>
              </DialogHeader>
              <AdminUserForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                selectedUser={selectedUser}
                roles={roles}
                statuses={statuses}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={loading}>Cancelar</Button>
                <Button type="submit" form="user-form" className="bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <AlertDialogContent className="sm:max-w-md bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">Confirmar Eliminación</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que quieres eliminar al usuario "{userToDelete?.name || userToDelete?.email}"? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteConfirmOpen(false)} disabled={loading}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} disabled={loading} className="bg-destructive hover:bg-destructive/80">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      );
    };

    export default AdminUsersPage;
  