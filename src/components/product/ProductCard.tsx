import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import AnimatedImage from '@/components/ui/AnimatedImage';
interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  return <Link to={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden mb-4">
        <AnimatedImage src={product.images[0]} alt={`${product.name} in ${product.color}`} aspectRatio="portrait" className="group-hover:scale-105 transition-transform duration-700" />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg text-zinc-950">{product.name}</h3>
          <p className="text-sm text-zinc-950">{product.color}</p>
        </div>
        <div className="text-right">
          {product.isSale && product.salePrice ? <div>
              <span className="line-through text-mono-500 mr-2">€{product.price}</span>
              <span className="text-mono-100">€{product.salePrice}</span>
            </div> : <span className="text-zinc-950">€{product.price}</span>}
        </div>
      </div>
    </Link>;
};
export default ProductCard;