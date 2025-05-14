
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

    const ManualSectionContent = ({ item, sectionIndex, itemIndex }) => {
      return (
        <AccordionItem value={`item-${sectionIndex}-${itemIndex}`} className="border-b border-border/50 last:border-b-0">
          <AccordionTrigger className="text-left hover:no-underline py-4 text-lg sm:text-xl font-medium text-foreground">
            <span className="flex items-center">
              {item.icon}
              {item.subtitle}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 text-base text-muted-foreground leading-relaxed space-y-2">
            <ul className="list-decimal list-inside space-y-1 pl-4">
              {item.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ul>
            {item.imageSuggestion && (
              <p className="mt-3 text-xs italic text-primary/80">
                (Sugerencia para imagen/video: {item.imageSuggestion})
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      );
    };

    const ManualSection = ({ section, sectionIndex }) => {
      return (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
          className="bg-card p-6 rounded-lg shadow-xl"
        >
          <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center">
            {section.icon}
            {section.title}
          </h2>
          <Accordion type="multiple" className="w-full">
            {section.content.map((item, itemIndex) => (
              <ManualSectionContent
                key={itemIndex}
                item={item}
                sectionIndex={sectionIndex}
                itemIndex={itemIndex}
              />
            ))}
          </Accordion>
        </motion.section>
      );
    };

    export default ManualSection;
  