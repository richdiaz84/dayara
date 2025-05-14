
    import React from 'react';
    import { TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { motion } from 'framer-motion';

    const ReportSectionTabs = ({ reportSections, cardVariants }) => {
      return (
        <motion.div variants={cardVariants}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-auto bg-muted/50">
            {reportSections.map((section) => (
              <TabsTrigger 
                key={section.value} 
                value={section.value} 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex items-center gap-2 py-2.5"
              >
                {section.icon} {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>
      );
    };

    export default ReportSectionTabs;
  