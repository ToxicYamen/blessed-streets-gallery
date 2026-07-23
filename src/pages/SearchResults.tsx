import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { RotateCcw, SearchX } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

const COLOR_OPTIONS = [
  { value: 'all', label: 'Alle Farben' },
  { value: 'black', label: 'Schwarz' },
  { value: 'khaki', label: 'Khaki' },
];

const SIZE_OPTIONS = [
  { value: 'all', label: 'Alle Größen' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [results, setResults] = useState<Product[]>([]);

  const { data: allProducts = [], isLoading } = useProducts();
  const reduceMotion = usePrefersReducedMotion();

  // Entrance nur einmalig — kein erneuter Stagger bei Filter-/Suchwechseln.
  const hasEnteredRef = useRef(false);
  useEffect(() => {
    if (isLoading || allProducts.length === 0) return;
    const timer = window.setTimeout(() => {
      hasEnteredRef.current = true;
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isLoading, allProducts.length]);

  useEffect(() => {
    // Perform the search when the component mounts or when search parameters change
    const performSearch = () => {
      // Filter products based on search query and selected filters
      const filteredProducts = allProducts.filter(product => {
        const matchesQuery = initialQuery ?
          product.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(initialQuery.toLowerCase()) : true;

        const colorMatch = selectedColor === 'all' || product.color === selectedColor;
        const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize as any);

        return matchesQuery && colorMatch && sizeMatch;
      });

      setResults(filteredProducts);
    };

    performSearch();
  }, [initialQuery, selectedColor, selectedSize, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL with the new search query
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('q', searchQuery);
    window.history.pushState({}, '', `${location.pathname}?${newSearchParams.toString()}`);

    // Trigger a search with the updated query
    const filteredProducts = allProducts.filter(product => {
      const matchesQuery = searchQuery ?
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;

      const colorMatch = selectedColor === 'all' || product.color === selectedColor;
      const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize as any);

      return matchesQuery && colorMatch && sizeMatch;
    });

    setResults(filteredProducts);
  };

  const resetFilters = () => {
    setSelectedSize('all');
    setSelectedColor('all');
  };

  return (
    <div className="pt-24">
      {/* Schmale editoriale Kopfzeile — analog zum Shop */}
      <header className="border-b border-mono-800">
        <div className="blesssed-container py-10 md:py-14">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-mono-500">
            Blessed Streets — Suche
          </p>
          <h1 className="mb-4 font-display text-4xl tracking-tight text-white md:text-6xl">
            Suche
          </h1>
          <p className="text-mono-400">
            {initialQuery ? (
              <>
                Ergebnisse für <span className="text-white">„{initialQuery}“</span>
              </>
            ) : (
              'Durchsuche den gesamten Shop.'
            )}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-md gap-2">
            <SearchInput
              type="search"
              placeholder="Wonach suchst du?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-11 border-mono-700 bg-mono-900/50 backdrop-blur"
            />
            <Button type="submit" className="min-h-11 cursor-pointer px-6">
              Suchen
            </Button>
          </form>
        </div>
      </header>

      {/* Results Section */}
      <section className="py-12 md:py-16">
        <div className="blesssed-container">
          <div className="flex flex-col gap-10 md:flex-row">
            {/* Filters */}
            <aside className="w-full shrink-0 md:w-64" aria-label="Produktfilter">
              <h2 className="mb-6 font-mono text-[11px] uppercase tracking-widest text-mono-500">
                Filter
              </h2>

              <div className="mb-8">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mono-500">
                  Farbe
                </h3>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  {COLOR_OPTIONS.map(option => (
                    <div key={option.value} className="flex min-h-11 items-center gap-3">
                      <RadioGroupItem
                        value={option.value}
                        id={`color-${option.value}`}
                        className="border-mono-500 text-white"
                      />
                      <Label
                        htmlFor={`color-${option.value}`}
                        className="cursor-pointer text-sm text-mono-300"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="mb-8">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mono-500">
                  Größe
                </h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  {SIZE_OPTIONS.map(option => (
                    <div key={option.value} className="flex min-h-11 items-center gap-3">
                      <RadioGroupItem
                        value={option.value}
                        id={`size-${option.value}`}
                        className="border-mono-500 text-white"
                      />
                      <Label
                        htmlFor={`size-${option.value}`}
                        className="cursor-pointer text-sm text-mono-300"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 cursor-pointer px-3 text-xs text-mono-400 hover:text-white"
                onClick={resetFilters}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Filter zurücksetzen
              </Button>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-mono-400">Produkte werden geladen…</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border border-mono-800 px-8 py-20 text-center">
                  <SearchX className="mb-4 h-10 w-10 text-mono-500" aria-hidden="true" />
                  <h3 className="mb-2 font-display text-2xl text-white">
                    {initialQuery ? <>Nichts gefunden für „{initialQuery}“</> : 'Nichts gefunden'}
                  </h3>
                  <p className="mb-8 max-w-sm text-mono-400">
                    Versuch es mit einem anderen Begriff — oder stöbere direkt in unseren Drops.
                  </p>
                  <Button asChild className="min-h-11 px-6">
                    <Link to="/shop">Zum Shop</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-mono-500">
                    {results.length} {results.length === 1 ? 'Produkt' : 'Produkte'} gefunden
                  </p>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
                    {results.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={
                          reduceMotion || hasEnteredRef.current
                            ? false
                            : { opacity: 0, y: 16 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          ease: 'easeOut',
                          delay: index * 0.04,
                        }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
