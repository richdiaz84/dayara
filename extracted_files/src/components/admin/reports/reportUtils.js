
    import { format, subDays, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
    import { es } from "date-fns/locale";

    export const LOW_STOCK_THRESHOLD = 10;

    export const formatDateForSupabase = (date) => {
      if (!date) return null;
      return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    };

    export const formatDateForDisplay = (date) => {
        if (!date) return 'N/A';
        try {
            return format(parseISO(date), "dd MMM yyyy, HH:mm", { locale: es });
        } catch (e) {
            try {
                return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
            } catch (e2) {
                return 'Fecha inválida';
            }
        }
    };

    export const formatSimpleDateForDisplay = (date) => {
      if (!date) return 'N/A';
      try {
          return format(parseISO(date), "dd MMM yyyy", { locale: es });
      } catch (e) {
         try {
             return format(new Date(date), "dd MMM yyyy", { locale: es });
         } catch (e2) {
             return 'Fecha inválida';
         }
      }
    };
    
    export const getDefaultDateRange = () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    });

    export const dateRangePresets = [
      { label: "Hoy", range: { from: new Date(), to: new Date() } },
      { label: "Ayer", range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) } },
      { label: "Últimos 7 días", range: { from: subDays(new Date(), 6), to: new Date() } },
      { label: "Últimos 30 días", range: { from: subDays(new Date(), 29), to: new Date() } },
      { label: "Este mes", range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) } },
      { label: "Mes pasado", range: { from: startOfMonth(subDays(startOfMonth(new Date()), 1)), to: endOfMonth(subDays(startOfMonth(new Date()), 1)) } },
      { label: "Esta semana (Dom-Sab)", range: { from: startOfWeek(new Date(), { weekStartsOn: 0 }), to: endOfWeek(new Date(), { weekStartsOn: 0})}},
      { label: "Esta semana (Lun-Dom)", range: { from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1})}},
    ];
  