
    import React, { useState, useMemo, useEffect } from 'react';
    import { useLocation } from 'react-router-dom';
    import ProductCard from '@/components/ProductCard';
    import { supabase } from '@/lib/supabaseClient';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Slider } from '@/components/ui/slider';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Label } from '@/components/ui/label';
    import { Search, Filter, X, ArrowDownUp, Palette, Tag, Star as StarIcon, Loader2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";

    const ProductsPage = () => {
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const initialCategory = queryParams.get('category');

      const [allProducts, setAllProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const [priceRange, setPriceRange] = useState([0, 200]); // Max price might need adjustment
      const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
      const [sortBy, setSortBy] = useState('default');
      const [showFilters, setShowFilters] = useState(false);
      const [maxPrice, setMaxPrice] = useState(200);

      useEffect(() => {
        const fetchProductsAndCategories = async () => {
          setLoading(true);
          try {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('is_published', true);

            if (error) throw error;
            
            setAllProducts(data || []);
            if (data && data.length > 0) {
              const prices = data.map(p => p.price);
              const currentMaxPrice = Math.max(...prices, 200); // Ensure a minimum max if no products
              setMaxPrice(currentMaxPrice);
              setPriceRange([0, currentMaxPrice]);
            } else {
              setMaxPrice(200);
              setPriceRange([0, 200]);
            }

          } catch (error) {
            console.error("Error fetching products:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchProductsAndCategories();
      }, []);
      
      useEffect(() => {
        // Update selectedCategories if URL query param changes
        const newCategory = queryParams.get('category');
        if (newCategory && !selectedCategories.includes(newCategory)) {
          setSelectedCategories([newCategory]);
        } else if (!newCategory && initialCategory) {
          // If category is removed from URL, but was initial, clear it
          // This logic might need adjustment based on desired behavior
        }
      }, [location.search]);


      const categories = useMemo(() => {
        const productCategories = [...new Set(allProducts.map(p => p.category))];
        const predefinedCategories = [ // From your original list, ensure they are available
          "GEL SYSTEM", "ACRILYC SYSTEM", "DECORATION LINE", "NAIL TOOLS LINE",
          "3D CARVING GEL", "ART GEL", "EFFECT SYSTEM", "BRUSH", "STAMPING ART",
          "Esmaltes en Gel", "Decoración", "Herramientas", "Acrílicos", "Esmaltes"
        ];
        return [...new Set([...productCategories, ...predefinedCategories])].sort();
      }, [allProducts]);


      const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        if (searchTerm) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (selectedCategories.length > 0) {
          filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }
        
        switch (sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          // case 'rating-desc': // Assuming rating field exists
          //   filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0));
          //   break;
          default: // 'default' or by creation date if available
             filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        }

        return filtered;
      }, [allProducts, searchTerm, priceRange, selectedCategories, sortBy]);

      const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
          prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
      };
      
      const sortOptions = [
        { value: 'default', label: 'Más Recientes' },
        { value: 'price-asc', label: 'Precio: Menor a Mayor' },
        { value: 'price-desc', label: 'Precio: Mayor a Menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        // { value: 'rating-desc', label: 'Mejor Valorados' },
      ];

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

      if (loading && allProducts.length === 0) {
        return (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <div className="container py-8 md:py-12 animate-fadeIn">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              Nuestra Colección Exclusiva
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Encuentra todo lo que necesitas para crear obras de arte en tus uñas.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            <AnimatePresence>
              {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                <motion.aside 
                  key="filters-sidebar"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.3 }}
                  className={`md:w-1/4 lg:w-1/5 p-6 bg-card rounded-lg shadow-lg fixed md:sticky top-0 left-0 h-full md:h-auto w-full max-w-xs md:max-w-none z-50 md:z-auto overflow-y-auto md:top-24 ${showFilters ? 'block' : 'hidden md:block'}`}
                >
                  <div className="flex justify-between items-center mb-6 md:hidden">
                    <h3 className="text-xl font-semibold">Filtros</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="search-filter" className="text-lg font-semibold mb-2 flex items-center"><Search className="h-5 w-5 mr-2 text-primary"/>Buscar</Label>
                      <Input
                        id="search-filter"
                        type="text"
                        placeholder="Nombre del producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-background border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-2 flex items-center"><Palette className="h-5 w-5 mr-2 text-primary"/>Categorías</Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <Label htmlFor={`category-${category}`} className="font-normal text-sm cursor-pointer hover:text-primary capitalize">{category.toLowerCase()}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price-range" className="text-lg font-semibold mb-2 flex items-center"><Tag className="h-5 w-5 mr-2 text-primary"/>Rango de Precio</Label>
                      <Slider
                        id="price-range"
                        min={0}
                        max={maxPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-primary [&>span:last-child]:bg-primary [&>span:last-child]:border-primary"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    <Button onClick={() => { setSearchTerm(''); setPriceRange([0,maxPrice]); setSelectedCategories([]); setSortBy('default');}} className="w-full" variant="outline">Limpiar Filtros</Button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            <main className="w-full md:w-3/4 lg:w-4/5">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <Button
                  variant="outline"
                  className="md:hidden w-full sm:w-auto flex items-center border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" /> Mostrar Filtros
                </Button>
                <p className="text-sm text-muted-foreground">{loading ? <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" /> : `${filteredProducts.length} productos encontrados`}</p>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto flex items-center border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      Ordenar por: {sortOptions.find(opt => opt.value === sortBy)?.label || 'Por Defecto'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-primary/30">
                    {sortOptions.map(option => (
                      <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)} className="hover:bg-primary/20 focus:bg-primary/20">
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {loading && filteredProducts.length === 0 ? (
                 <div className="flex justify-center items-center min-h-[300px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" // Adjusted to 3 for potentially better view with sidebar
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map(product => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <StarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">¡Oops! No hay productos</h3>
                  <p className="text-muted-foreground">No se encontraron productos que coincidan con tus filtros. Intenta ajustarlos.</p>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      );
    };

    export default ProductsPage;
  