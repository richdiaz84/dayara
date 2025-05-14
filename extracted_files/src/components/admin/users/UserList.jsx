
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Edit, Trash2, UserCircle } from 'lucide-react';
    import { format } from 'date-fns';
    import { es } from 'date-fns/locale';

    const UserList = ({ users, onEdit, onDelete }) => {
      if (users.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No se encontraron usuarios.</p>;
      }

      const getInitials = (name) => {
        if (!name) return <UserCircle className="h-5 w-5" />;
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
      };

      const getStatusVariant = (status) => {
        switch (status) {
          case 'activo': return 'success';
          case 'inactivo': return 'outline';
          case 'suspendido': return 'destructive';
          default: return 'secondary';
        }
      };

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registrado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name || user.email} />
                    <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)} className="capitalize">{user.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: es }) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(user)} className="text-blue-500 hover:text-blue-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(user)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };

    export default UserList;
  