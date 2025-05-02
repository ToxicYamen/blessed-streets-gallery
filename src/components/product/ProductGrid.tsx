
import ProductCard from './ProductCard';

// Updated Product interface to match what we're getting from Supabase
interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  color: string | null;
  images: string[] | null;
  size: string[] | null;
  size_quantities: Record<string, number> | null;
  is_featured: boolean | null;
  is_new: boolean | null;
}

interface ProductGridProps {
  products: Product[];
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-mono-400 mb-2">No products found</p>
          <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
