
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminUserForm = ({ formData, setFormData, onSubmit, selectedUser, roles, statuses }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} id="user-form" className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Nombre Completo</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-background mt-1"/>
      </div>
      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-background mt-1"/>
      </div>
      <div>
        <Label htmlFor="role">Rol</Label>
        <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
          <SelectTrigger className="w-full bg-background mt-1 capitalize">
            <SelectValue placeholder="Seleccionar rol" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger className="w-full bg-background mt-1 capitalize">
            <SelectValue placeholder="Seleccionar estado" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
        <div>
        <Label htmlFor="password">{selectedUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</Label>
        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder={selectedUser ? 'Dejar en blanco para no cambiar' : '••••••••'} required={!selectedUser} className="bg-background mt-1"/>
      </div>
    </form>
  );
};

export default AdminUserForm;
