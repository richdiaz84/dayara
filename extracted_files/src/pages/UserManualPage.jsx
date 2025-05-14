
    import React from 'react';
    import { motion } from 'framer-motion';
    import ManualSection from '@/components/manual/ManualSection';
    import { manualData } from '@/components/manual/manualData'; 
    import { BookOpen } from 'lucide-react';

    const UserManualPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          <div className="text-center mb-12">
            <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              Manual de Usuario
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Guía completa para utilizar todas las funcionalidades de la plataforma.
            </p>
          </div>

          <div className="space-y-8">
            {manualData.map((section, sectionIndex) => (
              <ManualSection
                key={sectionIndex}
                section={section}
                sectionIndex={sectionIndex}
              />
            ))}
          </div>
        </motion.div>
      );
    };

    export default UserManualPage;
  