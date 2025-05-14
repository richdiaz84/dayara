
    import React from 'react';
    import { BarChart, FileText, Users, Package, AlertCircle, ShoppingCart } from 'lucide-react';
    import { LOW_STOCK_THRESHOLD } from '@/components/admin/reports/reportUtils';

    export const reportConfig = {
      sales: [
        { 
          name: "Resumen de Ventas", 
          description: "Ingresos totales, pedidos, ticket promedio.", 
          icon: <BarChart className="text-blue-500"/>, 
          actionKey: "Resumen de Ventas",
          requiresDateRange: true
        },
        { 
          name: "Ventas por Producto", 
          description: "Productos más vendidos, ingresos por producto.", 
          icon: <Package className="text-green-500"/>, 
          actionKey: "Ventas por Producto",
          requiresDateRange: true
        },
      ],
      inventory: [
        { 
          name: "Estado Actual del Stock", 
          description: "Niveles de stock de todos los productos.", 
          icon: <FileText className="text-indigo-500"/>, 
          actionKey: "Estado Actual del Stock",
          requiresDateRange: false
        },
        { 
          name: "Productos con Bajo Stock", 
          description: `Alertas de productos con stock <= ${LOW_STOCK_THRESHOLD}.`, 
          icon: <AlertCircle className="text-red-500"/>, 
          actionKey: "Productos con Bajo Stock",
          requiresDateRange: false
        },
      ],
      customers: [
        { 
          name: "Actividad de Clientes", 
          description: "Pedidos recientes, gasto total, frecuencia.", 
          icon: <ShoppingCart className="text-yellow-500"/>, 
          actionKey: "Actividad de Clientes",
          requiresDateRange: true
        },
      ]
    };
  