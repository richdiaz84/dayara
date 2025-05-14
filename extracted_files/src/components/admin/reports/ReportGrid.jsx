
    import React from 'react';
    import ReportCard from '@/components/admin/reports/ReportCard';
    import { motion } from 'framer-motion';

    const ReportGrid = ({ reports, onGenerate, onExport, isLoading, currentReportName }) => {
      return (
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }} 
          initial="hidden" 
          animate="visible" 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
          {reports.map((report, index) => (
            <ReportCard 
              key={index} 
              report={report} 
              onGenerate={() => onGenerate(report)} 
              onExport={onExport} 
              isLoading={isLoading} 
              currentReportName={currentReportName} 
            />
          ))}
        </motion.div>
      );
    };

    export default ReportGrid;
  