
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { UserPlus, Search, RefreshCw } from 'lucide-react';

    const UserActions = ({ onAddUser, onRefreshUsers, searchTerm, setSearchTerm, isLoading }) => {
      return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-input border-border focus:border-primary"
              />
            </div>
            <Button onClick={onAddUser} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="mr-2 h-5 w-5" /> Añadir
            </Button>
             <Button onClick={onRefreshUsers} variant="outline" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} /> Recargar
            </Button>
          </div>
        </div>
      );
    };

    export default UserActions;
  