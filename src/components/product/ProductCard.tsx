
import { useNavigate } from 'react-router-dom';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { pageTransition } from '@/lib/transitions';

interface ProductInventory {
  size: string;
  quantity: number;
}

// Updated Product interface to match what we're getting from both data/products.ts and Supabase
interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  color: string | null;
  images: string[] | null;
  size?: string[] | null;
  sizes?: string[]; // From data/products.ts
  size_quantities?: Record<string, number> | null;
  is_featured?: boolean | null;
  is_new?: boolean | null;
  featured?: boolean; // From data/products.ts
  isNew?: boolean; // From data/products.ts
  isSale?: boolean;
  salePrice?: number;
  inventory?: ProductInventory[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // GSAP Page Transition direkt auslösen
    pageTransition(() => {
      navigate(`/product/${product.id}`);
    });
  };

  // Check if any size has low stock
  const hasLowStock = () => {
    if (product.size_quantities) {
      return Object.values(product.size_quantities).some(qty => qty <= 3 && qty > 0);
    } 
    
    if (product.inventory) {
      return product.inventory.some(item => item.quantity <= 3 && item.quantity > 0);
    }
    
    return false;
  };

  return (
    <div className="group block" data-navigation="true">
      <div
        className="overflow-hidden mb-4 cursor-pointer"
        onClick={handleClick}
      >
        <AnimatedImage
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
          alt={`${product.name} in ${product.color || 'default'}`}
          aspectRatio="portrait"
          className="group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3
            className="font-medium text-lg text-foreground dark:text-foreground cursor-pointer"
            onClick={handleClick}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">{product.color}</p>
          {hasLowStock() && (
            <p className="text-red-500 text-sm font-medium mt-1 flex items-center">
              <span className="mr-1">⚠️</span> Nur noch sehr wenige auf Lager
            </p>
          )}
        </div>
        <div className="text-right">
          {product.isSale && product.salePrice ? (
            <div>
              <span className="line-through text-muted-foreground dark:text-muted-foreground mr-2">€{product.price}</span>
              <span className="text-foreground dark:text-foreground">€{product.salePrice}</span>
            </div>
          ) : (
            <span className="text-foreground dark:text-foreground">€{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
