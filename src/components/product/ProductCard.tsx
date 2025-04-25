import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { pageTransition } from '@/lib/transitions';

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

  return (
    <div className="group block" data-navigation="true">
      <div
        className="overflow-hidden mb-4 cursor-pointer"
        onClick={handleClick}
      >
        <AnimatedImage
          src={product.images[0]}
          alt={`${product.name} in ${product.color}`}
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
          {product.inventory.some(item => item.quantity <= 3) && (
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