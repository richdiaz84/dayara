
    import React, { useState, useEffect, useCallback } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { motion } from 'framer-motion';
    import { Loader2, Save } from 'lucide-react';
    import { useCurrency } from '@/contexts/CurrencyContext';

    const settingKeys = [
      'site_name', 'site_logo_url', 'contact_email', 'contact_phone',
      'address_line1', 'address_city', 'address_country',
      'social_facebook_url', 'social_instagram_url', 'social_twitter_url',
      'seo_meta_description', 'seo_meta_keywords', 'default_currency_symbol', 'default_currency_code'
    ];

    const AdminSettingsGeneralPage = () => {
      const [settings, setSettings] = useState({});
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const { toast } = useToast();
      const { refetchCurrencySettings } = useCurrency();

      const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.from('site_settings').select('setting_key, setting_value');
          if (error) throw error;
          
          const fetchedSettings = data.reduce((acc, curr) => {
            acc[curr.setting_key] = curr.setting_value || '';
            return acc;
          }, {});
          
          const defaultSettings = {
            site_name: 'Dayara Nail Art',
            site_logo_url: 'https://qpexrjoyxlnkempprujd.supabase.co/storage/v1/object/public/assets/dayara-nail-art-logo.png',
            contact_email: 'contacto@dayaranailart.com',
            contact_phone: '+502 1234 5678',
            address_line1: 'Calle Principal 123',
            address_city: 'Ciudad de Guatemala',
            address_country: 'Guatemala',
            social_facebook_url: 'https://facebook.com/dayaranailart',
            social_instagram_url: 'https://instagram.com/dayaranailart',
            social_twitter_url: '',
            seo_meta_description: 'La mejor tienda de productos para nail art en Guatemala. Calidad y variedad para profesionales y entusiastas.',
            seo_meta_keywords: 'nail art, uñas, esmaltes, acrílicas, decoración de uñas, Guatemala',
            default_currency_symbol: 'Q',
            default_currency_code: 'GTQ'
          };

          settingKeys.forEach(key => {
            if (!(key in fetchedSettings)) {
              fetchedSettings[key] = defaultSettings[key] || '';
            }
          });
          setSettings(fetchedSettings);

        } catch (error) {
          toast({ variant: "destructive", title: "Error al cargar configuración", description: error.message });
          setSettings({}); 
        } finally {
          setIsLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        fetchSettings();
      }, [fetchSettings]);

      const handleInputChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
      };

      const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
          const updates = Object.entries(settings).map(([key, value]) => ({
            setting_key: key,
            setting_value: value
          }));

          const { error } = await supabase.from('site_settings').upsert(updates, {
            onConflict: 'setting_key'
          });

          if (error) throw error;
          toast({ title: "Configuración Guardada", description: "Los cambios han sido guardados exitosamente." });
          refetchCurrencySettings(); 
        } catch (error) {
          toast({ variant: "destructive", title: "Error al guardar", description: error.message });
        } finally {
          setIsSaving(false);
        }
      };
      
      const renderInput = (key, label, type = "text") => (
        <div key={key}>
          <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
          <Input
            id={key}
            type={type}
            value={settings[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="mt-1 bg-input border-border focus:border-primary"
            disabled={isLoading || isSaving}
          />
        </div>
      );

      const renderTextarea = (key, label) => (
         <div key={key}>
          <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
          <Textarea
            id={key}
            value={settings[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="mt-1 bg-input border-border focus:border-primary min-h-[80px]"
            disabled={isLoading || isSaving}
          />
        </div>
      );


      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4 md:px-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configuración General</CardTitle>
              <CardDescription>
                Administra la configuración general de tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('site_name', 'Nombre del Sitio')}
                {renderInput('site_logo_url', 'URL del Logo del Sitio')}
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 mt-6 text-foreground">Moneda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('default_currency_symbol', 'Símbolo de Moneda (ej. Q, $)')}
                {renderInput('default_currency_code', 'Código de Moneda (ej. GTQ, USD)')}
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 mt-6 text-foreground">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('contact_email', 'Email de Contacto')}
                {renderInput('contact_phone', 'Teléfono de Contacto')}
                {renderInput('address_line1', 'Dirección (Línea 1)')}
                {renderInput('address_city', 'Ciudad')}
                {renderInput('address_country', 'País')}
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 mt-6 text-foreground">Redes Sociales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderInput('social_facebook_url', 'URL Facebook')}
                {renderInput('social_instagram_url', 'URL Instagram')}
                {renderInput('social_twitter_url', 'URL Twitter/X')}
              </div>
              
              <h3 className="text-lg font-semibold border-b pb-2 mt-6 text-foreground">SEO Básico</h3>
              <div className="space-y-4">
                {renderTextarea('seo_meta_description', 'Meta Descripción (para SEO)')}
                {renderInput('seo_meta_keywords', 'Palabras Clave (separadas por coma)')}
              </div>

            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleSaveSettings} disabled={isSaving || isLoading} className="bg-primary hover:bg-primary/90">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default AdminSettingsGeneralPage;
  