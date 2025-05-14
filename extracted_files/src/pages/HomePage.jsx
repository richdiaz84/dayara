
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import ProductCard from '@/components/ProductCard';
    import { supabase } from '@/lib/supabaseClient';
    import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
    import { ArrowRight, Sparkles, Tag, Palette, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'; // Import ChevronLeft, ChevronRight

    const HomePage = () => {
      const [featuredProducts, setFeaturedProducts] = useState([]);
      const [newArrivals, setNewArrivals] = useState([]);
      const [onSaleProducts, setOnSaleProducts] = useState([]);
      const [banners, setBanners] = useState([]);
      const [loading, setLoading] = useState(true);
      const [currentBanner, setCurrentBanner] = useState(0);

      useEffect(() => {
        const fetchHomePageData = async () => {
          setLoading(true);
          try {
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*')
              .eq('is_published', true)
              .limit(12); // Fetch more to distribute

            if (productsError) throw productsError;

            // Simple logic for featured, new, onSale for now.
            // In a real app, these would likely be specific flags or categories.
            setFeaturedProducts(productsData.slice(0, 4));
            setNewArrivals(productsData.slice(4, 8));
            setOnSaleProducts(productsData.slice(8, 12));

            const { data: bannersData, error: bannersError } = await supabase
              .from('banner_ads')
              .select('*')
              .eq('active', true)
              .or(`end_date.gte.${new Date().toISOString()},end_date.is.null`)
              .or(`start_date.lte.${new Date().toISOString()},start_date.is.null`)
              .order('created_at', { ascending: false });
            
            if (bannersError) throw bannersError;
            setBanners(bannersData || []);

          } catch (error) {
            console.error("Error fetching homepage data:", error);
            // Potentially set some error state here to show to user
          } finally {
            setLoading(false);
          }
        };
        fetchHomePageData();
      }, []);
      
      useEffect(() => {
        if (banners.length > 1) {
          const timer = setTimeout(() => {
            setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
          }, 5000); // Change banner every 5 seconds
          return () => clearTimeout(timer);
        }
      }, [currentBanner, banners.length]);


      const categories = [
        { name: "GEL SYSTEM", icon: <Palette className="h-8 w-8 text-primary" />, path: "/products?category=GEL%20SYSTEM" },
        { name: "ACRILYC SYSTEM", icon: <Sparkles className="h-8 w-8 text-primary" />, path: "/products?category=ACRILYC%20SYSTEM" },
        { name: "DECORATION", icon: <Tag className="h-8 w-8 text-primary" />, path: "/products?category=DECORATION%20LINE" },
        { name: "TOOLS", icon: <Palette className="h-8 w-8 text-primary" />, path: "/products?category=NAIL%20TOOLS%20LINE" },
      ];

      const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      };

      const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="animate-fadeIn space-y-12 md:space-y-16 lg:space-y-20 pb-16">
          {/* Hero Section - Banners */}
          {banners.length > 0 && (
            <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={banners[currentBanner].image_url} 
                    alt={banners[currentBanner].title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                    <motion.h1 
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      {banners[currentBanner].title}
                    </motion.h1>
                    {banners[currentBanner].description && (
                      <motion.p 
                        className="text-md sm:text-lg md:text-xl text-gray-200 max-w-xl mx-auto mb-6"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                      >
                        {banners[currentBanner].description}
                      </motion.p>
                    )}
                    {banners[currentBanner].link_url && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
                      >
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-3 px-8 rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                          <Link to={banners[currentBanner].link_url}>
                            Ver Más <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              {banners.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 w-2 rounded-full transition-all ${currentBanner === index ? 'bg-primary w-4' : 'bg-white/50'}`}
                        aria-label={`Ir al banner ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}
          
          {banners.length === 0 && ( /* Fallback Hero if no banners */
            <motion.section 
              className="relative bg-gradient-to-br from-primary/30 via-background to-background text-center py-20 md:py-32 lg:py-40 px-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 opacity-10">
                <img  alt="Abstract nail art background" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1585218334422-2ed3196f51c3" />
              </div>
              <div className="relative z-10 container mx-auto">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-primary to-purple-600"
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Deslumbra con Dayara
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Tu destino #1 para productos de nail art de calidad profesional. ¡Inspírate y crea!
                </motion.p>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
                >
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-3 px-8 rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                    <Link to="/products">
                      Explorar Productos <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.section>
          )}


          {/* Featured Categories Section */}
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-primary">Categorías Destacadas</h2>
            <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto">Encuentra exactamente lo que necesitas para tu próxima obra maestra.</p>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {categories.map((category) => (
                <motion.div key={category.name} variants={itemVariants}>
                  <Link to={category.path}>
                    <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center aspect-square justify-center">
                      <div className="p-3 bg-primary/10 rounded-full mb-3">
                        {category.icon}
                      </div>
                      <h3 className="text-md sm:text-lg font-semibold text-card-foreground">{category.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <section className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 text-primary">Productos Destacados</h2>
              <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto">Los favoritos de nuestras clientas, ¡descubre por qué!</p>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {featuredProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* New Arrivals Section */}
          {newArrivals.length > 0 && (
            <section className="bg-secondary/20 py-12 md:py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-4 text-primary">Novedades</h2>
                <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto">¡Lo último en llegar! No te pierdas las tendencias más frescas.</p>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {newArrivals.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* On Sale Section */}
          {onSaleProducts.length > 0 && (
             <section className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 text-primary">¡Ofertas Especiales!</h2>
              <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto">Aprovecha nuestros descuentos exclusivos por tiempo limitado.</p>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {onSaleProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Call to Action / Newsletter */}
          <section className="container mx-auto px-4">
            <motion.div 
              className="bg-gradient-to-r from-primary/80 to-purple-600/80 p-8 md:p-12 rounded-lg shadow-xl text-center text-primary-foreground"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Únete a Nuestra Comunidad</h2>
              <p className="text-base sm:text-lg mb-6 max-w-lg mx-auto">
                Suscríbete a nuestro boletín para recibir ofertas exclusivas, tutoriales y las últimas noticias del mundo del nail art.
              </p>
              <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                <Input type="email" placeholder="Tu correo electrónico" className="bg-background/20 text-foreground placeholder:text-muted-foreground border-transparent focus:bg-background/30 focus:ring-2 focus:ring-white" />
                <Button type="submit" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors duration-300">
                  Suscribirme
                </Button>
              </form>
            </motion.div>
          </section>
        </motion.div>
      );
    };

    export default HomePage;
  