
import { Product } from '@/data/products';
import ProductCard from './ProductCard';

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
