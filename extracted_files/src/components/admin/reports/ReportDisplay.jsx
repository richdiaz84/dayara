
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Loader2, DollarSign, ShoppingCart, TrendingUp, Users as UsersIcon, Package as PackageIcon } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { LOW_STOCK_THRESHOLD, formatSimpleDateForDisplay } from './reportUtils';

    const ReportDisplay = ({ reportData, isLoading, reportName, dateRange }) => {
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      if (isLoading) {
        return (
          <motion.div variants={cardVariants} className="mt-8">
            <Card className="bg-card/70 backdrop-blur-md min-h-[300px] flex flex-col">
              <CardHeader>
                <CardTitle>Cargando {reportName}...</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
          </motion.div>
        );
      }

      if (!reportData) {
        return null; 
      }
      
      const renderSalesSummary = (data) => (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">En {data.numberOfOrders} pedidos</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Número de Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.numberOfOrders}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.averageOrderValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      );

      const renderSalesByProduct = (data) => (
        <Table>
          <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="text-right">Cantidad Vendida</TableHead><TableHead className="text-right">Ingresos Totales</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.products.length === 0 && <TableRow><TableCell colSpan="3" className="text-center text-muted-foreground">No hay datos de ventas de productos para este período.</TableCell></TableRow>}
            {data.products.map(p => (<TableRow key={p.id}><TableCell className="font-medium"><Link to={`/admin/products?edit=${p.id}`} className="hover:underline">{p.name}</Link></TableCell><TableCell className="text-right">{p.quantitySold}</TableCell><TableCell className="text-right">${p.totalRevenue.toFixed(2)}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      );

      const renderCustomerActivity = (data) => (
        <Table>
          <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Pedidos</TableHead><TableHead className="text-right">Gasto Total</TableHead><TableHead>Último Pedido</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.customers.length === 0 && <TableRow><TableCell colSpan="5" className="text-center text-muted-foreground">No hay datos de actividad de clientes para este período.</TableCell></TableRow>}
            {data.customers.map(c => (<TableRow key={c.identifier}><TableCell className="font-medium">{c.userId ? <Link to={`/admin/users?edit=${c.userId}`} className="hover:underline">{c.name}</Link> : c.name}</TableCell><TableCell>{c.email}</TableCell><TableCell className="text-right">{c.orderCount}</TableCell><TableCell className="text-right">${c.totalSpent.toFixed(2)}</TableCell><TableCell>{formatSimpleDateForDisplay(c.lastOrderDate)}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      );

      const renderStockReport = (data, type) => (
         <Table>
          <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Stock Actual</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.products.length === 0 && <TableRow><TableCell colSpan="3" className="text-center text-muted-foreground">{type === "lowStock" ? "¡Buenas noticias! No hay productos con bajo stock." : "No hay productos para mostrar."}</TableCell></TableRow>}
            {data.products.map(p => (<TableRow key={p.id} className={p.stock <= LOW_STOCK_THRESHOLD && type !== "lowStock" ? "bg-destructive/10" : ""}><TableCell className="font-medium"><Link to={`/admin/products?edit=${p.id}`} className="hover:underline">{p.name}</Link></TableCell><TableCell>{p.category || 'N/A'}</TableCell><TableCell className={`text-right font-semibold ${p.stock <= LOW_STOCK_THRESHOLD ? 'text-destructive' : 'text-green-500'}`}>{p.stock}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      );
      
      let content;
      switch (reportData.type) {
        case "salesSummary": content = renderSalesSummary(reportData); break;
        case "salesByProduct": content = renderSalesByProduct(reportData); break;
        case "customerActivity": content = renderCustomerActivity(reportData); break;
        case "currentStock": content = renderStockReport(reportData, "currentStock"); break;
        case "lowStock": content = renderStockReport(reportData, "lowStock"); break;
        default: content = <p className="text-muted-foreground text-center p-6">No hay datos para mostrar para este reporte o tipo de visualización.</p>;
      }

      return (
        <motion.div variants={cardVariants} className="mt-8">
          <Card className="bg-card/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle>{reportName}</CardTitle>
              {(reportData.type === "salesSummary" || reportData.type === "salesByProduct" || reportData.type === "customerActivity") && dateRange?.from && dateRange?.to && (
                <CardDescription>Datos para el período: {formatSimpleDateForDisplay(dateRange.from)} - {formatSimpleDateForDisplay(dateRange.to)}</CardDescription>
              )}
              {(reportData.type === "currentStock" || reportData.type === "lowStock") && (
                <CardDescription>Datos actualizados al {formatSimpleDateForDisplay(new Date())}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="min-h-[200px] overflow-x-auto">
              {content}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ReportDisplay;
  