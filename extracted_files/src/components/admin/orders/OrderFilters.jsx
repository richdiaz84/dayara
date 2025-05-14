
    import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
    import { DatePickerWithRange } from '@/components/admin/DatePickerWithRange';
    import { X } from 'lucide-react';

    const OrderFilters = ({ filters, setFilters, dateRange, setDateRange, onResetFilters, allUsers, paymentStatuses, orderStatuses }) => {
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
      };
      
      return (
        <div className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <Input
              placeholder="Buscar por ID Pedido, Nombre Cliente..."
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="bg-background"
            />
            <Select value={filters.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Estado del Pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.paymentStatus} onValueChange={(value) => handleSelectChange('paymentStatus', value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Estado del Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Pagos</SelectItem>
                 {paymentStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="bg-background w-full"/>
             <Select value={filters.userId} onValueChange={(value) => handleSelectChange('userId', value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por Usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Usuarios</SelectItem>
                {allUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.email} ({user.raw_user_meta_data?.full_name || 'N/A'})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Total Mín."
              name="minTotal"
              value={filters.minTotal}
              onChange={handleInputChange}
              className="bg-background"
            />
            <Input
              type="number"
              placeholder="Total Máx."
              name="maxTotal"
              value={filters.maxTotal}
              onChange={handleInputChange}
              className="bg-background"
            />
            <Button onClick={onResetFilters} variant="outline" className="w-full lg:w-auto flex items-center gap-2">
              <X className="h-4 w-4" /> Limpiar Filtros
            </Button>
          </div>
        </div>
      );
    };

    export default OrderFilters;
  