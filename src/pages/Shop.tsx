import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import ProductCard from '@/components/product/ProductCard';
import ShinyText from '@/components/ShinyText';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Kein Neuanfang: Filterlogik & Datenfluss (useProducts) bleiben unangetastet,
// hier wird nur die Hülle veredelt (editoriale Kopfzeile, shadcn-Filter,
// Stagger-Entrance fürs Grid).

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

const Shop = () => {
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  const { data: allProducts = [], isLoading } = useProducts();
  const reduceMotion = usePrefersReducedMotion();

  // Entrance nur einmalig: nach dem ersten sichtbaren Grid keine
  // erneute Stagger-Animation beim Umschalten der Filter.
  const hasEnteredRef = useRef(false);
  useEffect(() => {
    if (isLoading || allProducts.length === 0) return;
    const timer = window.setTimeout(() => {
      hasEnteredRef.current = true;
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isLoading, allProducts.length]);

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
    const colorMatch = selectedColor === 'all' || product.color === selectedColor;
    const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize as any);
    return colorMatch && sizeMatch;
  });

  const resetFilters = () => {
    setSelectedSize('all');
    setSelectedColor('all');
  };

  return (
    <div className="pt-24">
      {/* Schmale editoriale Kopfzeile */}
      <header className="border-b border-mono-800">
        <div className="blesssed-container py-10 md:py-14">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-mono-500">
            Blessed Streets — Katalog
          </p>
          <h1 className="mb-4 font-display text-4xl tracking-tight text-white md:text-6xl">
            Shop
          </h1>
          <ShinyText
            text="Limitierte Drops · Kostenloser DE-Versand ab 50 €"
            disabled={reduceMotion}
            speed={3}
            delay={1.5}
            color="#8A898C"
            shineColor="#ffffff"
            className="font-mono text-xs uppercase tracking-widest md:text-sm"
          />
        </div>
      </header>

      {/* Products Section */}
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

            {/* Products */}
            <div className="flex-1">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-mono-400">Produkte werden geladen…</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-mono-800 px-8 py-16 text-center">
                  <h3 className="mb-2 font-display text-2xl text-white">
                    Keine Produkte gefunden
                  </h3>
                  <p className="mb-6 text-mono-400">
                    Passe deine Filter an, um wieder Treffer zu sehen.
                  </p>
                  <Button
                    variant="outline"
                    className="min-h-11 cursor-pointer px-6"
                    onClick={resetFilters}
                  >
                    Filter zurücksetzen
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
                  {filteredProducts.map((product, index) => (
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
