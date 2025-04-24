
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '@/data/products';
import ProductGrid from '@/components/product/ProductGrid';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { ShoppingBag, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const relatedProducts = id ? getRelatedProducts(id, 4) : [];
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    console.log('Added to cart:', {
      productId: product?.id,
      size: selectedSize,
      quantity,
    });
    
    // Here you would typically add the item to your cart state or context
  };
  
  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', product?.id);
    // Here you would typically add the item to your wishlist state or context
  };
  
  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-mono-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="bg-mono-100 text-mono-900 px-6 py-3 inline-block hover:bg-mono-200 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24">
      <div className="blesssed-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden">
              <AnimatedImage
                src={product.images[selectedImage]}
                alt={`${product.name} in ${product.color}`}
                aspectRatio="square"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`block border ${
                    index === selectedImage ? 'border-mono-100' : 'border-mono-700'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} in ${product.color} - view ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-mono-400 capitalize mb-6">{product.color}</p>
            
            <p className="text-xl font-medium mb-6">€{product.price}</p>
            
            <div className="mb-8">
              <h2 className="text-sm font-medium mb-2">Size</h2>
              <div className="flex gap-3 mb-2">
                {product.inventory.map((item) => {
                  const isOutOfStock = item.quantity === 0;
                  const isSelected = selectedSize === item.size;
                  
                  return (
                    <button
                      key={item.size}
                      onClick={() => setSelectedSize(isOutOfStock ? null : item.size)}
                      disabled={isOutOfStock}
                      className={`w-12 h-12 flex items-center justify-center border ${
                        isSelected 
                          ? 'border-mono-100 bg-mono-800' 
                          : isOutOfStock 
                          ? 'border-mono-700 bg-mono-800/50 text-mono-600 cursor-not-allowed' 
                          : 'border-mono-700 hover:border-mono-400'
                      }`}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-mono-500">
                {selectedSize 
                  ? `${product.inventory.find(i => i.size === selectedSize)?.quantity} in stock` 
                  : 'Select a size'}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-sm font-medium mb-2">Quantity</h2>
              <div className="flex border border-mono-700">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <div className="w-12 h-12 flex items-center justify-center border-l border-r border-mono-700">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-lg"
                  disabled={quantity >= (selectedSize ? product.inventory.find(i => i.size === selectedSize)?.quantity || 0 : 0)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 bg-mono-100 text-mono-900 py-3 flex items-center justify-center gap-2 hover:bg-mono-200 transition-colors disabled:bg-mono-500 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className="flex-1 border border-mono-400 py-3 flex items-center justify-center gap-2 hover:bg-mono-800 transition-colors"
              >
                <Heart size={16} />
                Add to Wishlist
              </button>
            </div>
            
            <div className="border-t border-mono-800 pt-6">
              <p className="mb-6">{product.description}</p>
              
              <div className="space-y-4 text-sm">
                <p>
                  <span className="text-mono-400">Color:</span> {product.color}
                </p>
                <p>
                  <span className="text-mono-400">Sizes:</span> {product.sizes.join(", ")}
                </p>
                <p>
                  <span className="text-mono-400">Product ID:</span> {product.id}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold mb-8">You may also like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
