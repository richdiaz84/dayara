
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Download, FileText, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';

    const ReportCard = ({ report, onGenerate, onExport, isLoading, currentReportName }) => {
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      return (
        <motion.div variants={cardVariants}>
          <Card className="h-full flex flex-col bg-card hover:shadow-primary/10 transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-md">{report.icon}</div>
              <div>
                <CardTitle className="text-lg text-foreground">{report.name}</CardTitle>
                <CardDescription className="mt-1 text-xs">{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto flex justify-end space-x-2 p-4 pt-0">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" onClick={() => onGenerate(report)} disabled={isLoading}>
                {isLoading && currentReportName === report.name ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                Ver
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => onExport(report.name)}>
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ReportCard;
  