
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminUserTable = ({ users, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Avatar</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Fecha de Registro</TableHead>
          <TableHead className="text-right">Gastado</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id} className="hover:bg-muted/50">
            <TableCell>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.email}.png?s=32`} alt={user.full_name || user.name} />
                <AvatarFallback>{(user.full_name || user.name || 'U').substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium text-foreground">{user.full_name || user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell className="text-muted-foreground capitalize">{user.role}</TableCell>
            <TableCell className="text-muted-foreground">{user.created_at ? new Date(user.created_at).toLocaleDateString() : (user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A')}</TableCell>
            <TableCell className="text-right text-muted-foreground">${user.total_spent?.toFixed(2) || user.totalSpent?.toFixed(2) || '0.00'}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 text-xs font-medium rounded-full
                ${user.status === 'activo' || user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 
                  user.status === 'inactivo' || user.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'}`}>
                {user.status ? (user.status.charAt(0).toUpperCase() + user.status.slice(1)) : 'N/A'}
              </span>
            </TableCell>
            <TableCell className="text-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(user)} className="text-blue-500 border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
              {user.role !== 'admin' && ( 
                <Button variant="outline" size="icon" onClick={() => onDelete(user)} className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminUserTable;
