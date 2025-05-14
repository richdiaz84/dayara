
    import React from 'react';
    import { supabase } from '@/lib/supabaseClient';

    const SitemapGenerator = () => {
      const generateSitemap = async () => {
        const baseUrl = window.location.origin;
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        const staticPages = [
          '/',
          '/products',
          '/cart',
          '/auth',
          '/faq',
          '/contact',
          '/shipping',
          '/privacy',
          '/manual',
          '/request-quote',
          '/wishlist',
          '/compare'
        ];

        staticPages.forEach(page => {
          sitemapContent += `  <url>\n`;
          sitemapContent += `    <loc>${baseUrl}${page}</loc>\n`;
          sitemapContent += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
          sitemapContent += `    <changefreq>weekly</changefreq>\n`;
          sitemapContent += `    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n`;
          sitemapContent += `  </url>\n`;
        });

        try {
          const { data: products, error } = await supabase.from('products').select('id, updated_at').eq('is_published', true);
          if (error) {
            console.error("Error fetching products for sitemap:", error);
          } else if (products) {
            products.forEach(product => {
              sitemapContent += `  <url>\n`;
              sitemapContent += `    <loc>${baseUrl}/products/${product.id}</loc>\n`;
              sitemapContent += `    <lastmod>${product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>\n`;
              sitemapContent += `    <changefreq>monthly</changefreq>\n`;
              sitemapContent += `    <priority>0.7</priority>\n`;
              sitemapContent += `  </url>\n`;
            });
          }
        } catch (e) {
          console.error("Error in sitemap product fetch:", e);
        }
        
        sitemapContent += `</urlset>`;

        const blob = new Blob([sitemapContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sitemap.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      };

      return (
        <div className="p-4 m-4 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Generador de Sitemap</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Haz clic en el botón para generar y descargar el archivo sitemap.xml. 
            Deberás subir este archivo a la raíz de tu directorio público en tu servidor.
          </p>
          <button 
            onClick={generateSitemap}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Generar Sitemap.xml
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Nota: Este es un generador manual. Para producción, considera generar el sitemap durante el proceso de build o dinámicamente en el servidor.
          </p>
        </div>
      );
    };

    export default SitemapGenerator;
  