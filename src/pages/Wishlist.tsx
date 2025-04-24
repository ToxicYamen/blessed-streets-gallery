
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { toast } from 'sonner';

const Wishlist = () => {
  // Mock wishlist data - in a real app, this would come from a state management solution
  const [wishlistItems, setWishlistItems] = useState<Product[]>([
    {
      id: "black-hoodie",
      name: "Blesssed Streets Logo Hoodie",
      price: 99.99,
      description: "Premium black hoodie featuring the iconic Blesssed Streets logo embroidery.",
      color: "black",
      images: ["/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png"],
      sizes: ["M", "L", "XL"],
      inventory: [
        { size: "M", quantity: 15 },
        { size: "L", quantity: 18 },
        { size: "XL", quantity: 10 }
      ],
      featured: true,
      isNew: true
    }
  ]);

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    toast.success('Item removed from wishlist');
  };

  const addToCart = (product: Product) => {
    // In a real app, this would add the item to the cart
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">MY WISHLIST</h1>
          <p className="text-mono-400 max-w-2xl">
            Items you've saved for later. Add them to your cart whenever you're ready.
          </p>
        </div>
      </section>
      
      {/* Wishlist Content */}
      <section className="py-16">
        <div className="blesssed-container">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl mb-4">Your wishlist is empty</h2>
              <p className="text-mono-400 mb-8">Explore our shop and add items to your wishlist by clicking the heart icon.</p>
              <Link to="/shop">
                <Button>Explore Shop</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-mono-800">
                    <tr>
                      <th className="py-4 text-left">Product</th>
                      <th className="py-4 text-left">Price</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mono-800">
                    {wishlistItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-6">
                          <div className="flex items-center">
                            <div className="w-20 h-20 mr-4 overflow-hidden rounded-xl">
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Link to={`/product/${item.id}`} className="font-medium hover:underline">
                                {item.name}
                              </Link>
                              <p className="text-mono-400 text-sm mt-1">Color: {item.color}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">${item.price.toFixed(2)}</td>
                        <td className="py-6">
                          <div className="flex justify-end gap-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => addToCart(item)}
                              title="Add to cart"
                            >
                              <ShoppingBag size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeFromWishlist(item.id)}
                              title="Remove from wishlist"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-mono-800">
                <Link to="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
