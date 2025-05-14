
    import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';

    const CurrencyContext = createContext({
      currencySymbol: 'Q',
      currencyCode: 'GTQ',
      formatCurrency: (amount) => `Q${Number(amount || 0).toFixed(2)}`,
      loadingSettings: true,
    });

    export const useCurrency = () => useContext(CurrencyContext);

    export const CurrencyProvider = ({ children }) => {
      const [currencySymbol, setCurrencySymbol] = useState('Q');
      const [currencyCode, setCurrencyCode] = useState('GTQ');
      const [loadingSettings, setLoadingSettings] = useState(true);

      const fetchCurrencySettings = useCallback(async () => {
        setLoadingSettings(true);
        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, setting_value')
            .in('setting_key', ['default_currency_symbol', 'default_currency_code']);

          if (error) {
            console.error('Error fetching currency settings:', error);
            throw error;
          }
          
          let symbol = 'Q';
          let code = 'GTQ';

          if (data) {
            const symbolSetting = data.find(s => s.setting_key === 'default_currency_symbol');
            const codeSetting = data.find(s => s.setting_key === 'default_currency_code');
            if (symbolSetting && symbolSetting.setting_value) symbol = symbolSetting.setting_value;
            if (codeSetting && codeSetting.setting_value) code = codeSetting.setting_value;
          }
          
          setCurrencySymbol(symbol);
          setCurrencyCode(code);

        } catch (err) {
          console.error('Failed to load currency settings, using defaults.', err);
          setCurrencySymbol('Q');
          setCurrencyCode('GTQ');
        } finally {
          setLoadingSettings(false);
        }
      }, []);

      useEffect(() => {
        fetchCurrencySettings();
      }, [fetchCurrencySettings]);

      const formatCurrency = useCallback((amount) => {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
          return `${currencySymbol}0.00`;
        }
        return `${currencySymbol}${numericAmount.toFixed(2)}`;
      }, [currencySymbol]);

      return (
        <CurrencyContext.Provider value={{ currencySymbol, currencyCode, formatCurrency, loadingSettings, refetchCurrencySettings: fetchCurrencySettings }}>
          {children}
        </CurrencyContext.Provider>
      );
    };
  