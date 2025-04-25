import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllProducts, Product } from '@/data/products';
import ProductGrid from '@/components/product/ProductGrid';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    // Perform the search when the component mounts or when search parameters change
    const performSearch = () => {
      const allProducts = getAllProducts();

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
  }, [initialQuery, selectedColor, selectedSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL with the new search query
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('q', searchQuery);
    window.history.pushState({}, '', `${location.pathname}?${newSearchParams.toString()}`);

    // Trigger a search with the updated query
    const allProducts = getAllProducts();
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

  return (
    <div className="pt-24">
      <PageHeader
        title="SEARCH RESULTS"
        description={initialQuery ? `Results for "${initialQuery}"` : 'Browse all products'}
      >
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mt-8">
          <SearchInput
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/50 backdrop-blur border-black dark:border-white/10"
          />
          <Button type="submit">Search</Button>
        </form>
      </PageHeader>

      {/* Results Section */}
      <section className="py-16">
        <div className="blesssed-container">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <div className="w-full md:w-64 shrink-0">
              <h2 className="text-lg font-medium mb-4">FILTERS</h2>

              <div className="mb-8">
                <h3 className="text-sm uppercase text-mono-500 mb-3">Color</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="color-all"
                      name="color"
                      className="mr-2"
                      checked={selectedColor === 'all'}
                      onChange={() => setSelectedColor('all')}
                    />
                    <label htmlFor="color-all" className="text-sm">All Colors</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="color-black"
                      name="color"
                      className="mr-2"
                      checked={selectedColor === 'black'}
                      onChange={() => setSelectedColor('black')}
                    />
                    <label htmlFor="color-black" className="text-sm">Black</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="color-khaki"
                      name="color"
                      className="mr-2"
                      checked={selectedColor === 'khaki'}
                      onChange={() => setSelectedColor('khaki')}
                    />
                    <label htmlFor="color-khaki" className="text-sm">Khaki</label>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm uppercase text-mono-500 mb-3">Size</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="size-all"
                      name="size"
                      className="mr-2"
                      checked={selectedSize === 'all'}
                      onChange={() => setSelectedSize('all')}
                    />
                    <label htmlFor="size-all" className="text-sm">All Sizes</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="size-m"
                      name="size"
                      className="mr-2"
                      checked={selectedSize === 'M'}
                      onChange={() => setSelectedSize('M')}
                    />
                    <label htmlFor="size-m" className="text-sm">M</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="size-l"
                      name="size"
                      className="mr-2"
                      checked={selectedSize === 'L'}
                      onChange={() => setSelectedSize('L')}
                    />
                    <label htmlFor="size-l" className="text-sm">L</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="size-xl"
                      name="size"
                      className="mr-2"
                      checked={selectedSize === 'XL'}
                      onChange={() => setSelectedSize('XL')}
                    />
                    <label htmlFor="size-xl" className="text-sm">XL</label>
                  </div>
                </div>
              </div>

              <button
                className="text-sm underline text-mono-400"
                onClick={() => {
                  setSelectedSize('all');
                  setSelectedColor('all');
                }}
              >
                Clear all filters
              </button>
            </div>

            {/* Results */}
            <div className="flex-1">
              {results.length === 0 ? (
                <div className="p-8 text-center">
                  <h3 className="text-xl mb-2">No products found</h3>
                  <p className="text-mono-400">Try adjusting your search or filters to find products.</p>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-mono-400">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
                  <ProductGrid products={results} />
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
