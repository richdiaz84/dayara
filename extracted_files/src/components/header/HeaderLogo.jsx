
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient'; // Assuming supabaseClient is configured

    const HeaderLogo = () => {
      const [logoUrl, setLogoUrl] = useState('https://qpexrjoyxlnkempprujd.supabase.co/storage/v1/object/public/assets/dayara-nail-art-logo.png'); // Default logo
      const [siteName, setSiteName] = useState('Dayara'); // Default site name

      useEffect(() => {
        const fetchSiteSettings = async () => {
          const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, setting_value')
            .in('setting_key', ['site_logo_url', 'site_name']);

          if (error) {
            console.error('Error fetching site settings for logo:', error);
          } else if (data) {
            const logoSetting = data.find(s => s.setting_key === 'site_logo_url');
            const nameSetting = data.find(s => s.setting_key === 'site_name');
            if (logoSetting && logoSetting.setting_value) {
              setLogoUrl(logoSetting.setting_value);
            }
            if (nameSetting && nameSetting.setting_value) {
              setSiteName(nameSetting.setting_value);
            }
          }
        };
        fetchSiteSettings();
      }, []);

      return (
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <img src={logoUrl} alt={`${siteName} Logo`} className="h-8 sm:h-10 md:h-12 object-contain" />
          <span className="font-bold text-xl sm:text-2xl text-primary hidden xs:inline">{siteName}</span>
        </Link>
      );
    };

    export default HeaderLogo;
  