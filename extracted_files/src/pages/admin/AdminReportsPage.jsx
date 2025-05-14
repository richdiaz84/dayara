
    import React, { useState, useCallback } from 'react';
    import { DatePickerWithRange } from '@/components/admin/DatePickerWithRange'; 
    import { TrendingUp, Archive, Users as UsersIcon } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Tabs, TabsContent } from "@/components/ui/tabs";
    import { useToast } from '@/components/ui/use-toast';
    import ReportDisplay from '@/components/admin/reports/ReportDisplay';
    import ReportSectionTabs from '@/components/admin/reports/ReportSectionTabs';
    import ReportGrid from '@/components/admin/reports/ReportGrid';
    import { getDefaultDateRange, dateRangePresets } from '@/components/admin/reports/reportUtils';
    import { 
      fetchSalesSummaryData, 
      fetchSalesByProductData, 
      fetchCustomerActivityData, 
      fetchCurrentStockData, 
      fetchLowStockProductsData 
    } from '@/components/admin/reports/dataFetcher';
    import { reportConfig } from '@/components/admin/reports/reportConfig';

    const AdminReportsPage = () => {
      const { toast } = useToast();
      const [dateRange, setDateRange] = useState(getDefaultDateRange());
      const [activeReportData, setActiveReportData] = useState(null);
      const [loadingReport, setLoadingReport] = useState(false);
      const [currentReportName, setCurrentReportName] = useState('');

      const reportActions = {
        "Resumen de Ventas": () => fetchSalesSummaryData(dateRange),
        "Ventas por Producto": () => fetchSalesByProductData(dateRange),
        "Actividad de Clientes": () => fetchCustomerActivityData(dateRange),
        "Estado Actual del Stock": fetchCurrentStockData,
        "Productos con Bajo Stock": fetchLowStockProductsData,
      };
      
      const handleGenerateReport = useCallback(async (report) => {
        if (report.requiresDateRange && (!dateRange.from || !dateRange.to)) {
          toast({ variant: "destructive", title: "Fechas Requeridas", description: "Por favor selecciona un rango de fechas." });
          return;
        }

        setLoadingReport(true);
        setCurrentReportName(report.name);
        setActiveReportData(null);
        try {
          const fetchData = reportActions[report.name];
          if (fetchData) {
            const data = await fetchData();
            setActiveReportData(data);
          } else {
            throw new Error(`Acción no definida para ${report.name}`);
          }
        } catch (err) {
          console.error(`Error fetching ${report.name}:`, err);
          toast({ variant: "destructive", title: "Error", description: `No se pudo cargar el reporte: ${report.name}. ${err.message}` });
          setActiveReportData(null);
        } finally {
          setLoadingReport(false);
        }
      }, [dateRange, toast, reportActions]);
      
      const reportSections = [
        { value: "sales", title: "Ventas", icon: <TrendingUp className="h-5 w-5"/>, reports: reportConfig.sales },
        { value: "inventory", title: "Inventario", icon: <Archive className="h-5 w-5"/>, reports: reportConfig.inventory },
        { value: "customers", title: "Clientes", icon: <UsersIcon className="h-5 w-5"/>, reports: reportConfig.customers }
      ];

      const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
      
      const handleExportReport = (reportName) => toast({title: "En Desarrollo", description:`La exportación para "${reportName}" se implementará pronto.`});

      return (
        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-8 p-4 md:p-6"
        >
          <motion.div variants={cardVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Reportes y Analíticas</h1>
            <div className="w-full md:w-auto">
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} presets={dateRangePresets} className="bg-card"/>
            </div>
          </motion.div>
          
          <Tabs defaultValue={reportSections[0].value} className="w-full">
            <ReportSectionTabs reportSections={reportSections} cardVariants={cardVariants} />

            {reportSections.map((section) => (
              <TabsContent key={section.value} value={section.value} className="mt-6">
                <ReportGrid 
                  reports={section.reports}
                  onGenerate={handleGenerateReport}
                  onExport={handleExportReport}
                  isLoading={loadingReport}
                  currentReportName={currentReportName}
                />
              </TabsContent>
            ))}
          </Tabs>
          
          <ReportDisplay 
            reportData={activeReportData} 
            isLoading={loadingReport} 
            reportName={currentReportName} 
            dateRange={dateRange} 
          />

        </motion.div>
      );
    };

    export default AdminReportsPage;
  