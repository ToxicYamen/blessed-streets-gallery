import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/lib/store/cart';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatPrice, useCountry } from '@/lib/country';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [country] = useCountry();

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Artikel wurde von der Wunschliste entfernt');
  };

  const handleAddToCart = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
    toast.success(`${item.name} (Größe: ${item.size}) wurde zum Warenkorb hinzugefügt`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="pt-24">
      <PageHeader
        title="MY WISHLIST"
        description="Items you've saved for later. Add them to your cart whenever you're ready."
      />

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="blesssed-container">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl mb-4">Deine Wunschliste ist leer</h2>
              <p className="text-mono-400 mb-8">Entdecke unseren Shop und speichere Artikel über das Herz-Symbol auf deiner Wunschliste.</p>
              <Button onClick={() => navigate('/shop')}>Zum Shop</Button>
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
                      <tr key={`${item.id}-${item.size}`}>
                        <td className="py-6">
                          <div className="flex items-center">
                            <div className="w-20 h-20 mr-4 overflow-hidden rounded-xl">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => handleProductClick(item.id)}
                                className="font-medium hover:underline"
                              >
                                {item.name}
                              </button>
                              <p className="text-mono-400 text-sm mt-1">
                                Größe: {item.size}
                                {item.color ? ` · Farbe: ${item.color}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">{formatPrice(item.price, country)}</td>
                        <td className="py-6">
                          <div className="flex justify-end gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAddToCart(item)}
                              title="In den Warenkorb"
                            >
                              <ShoppingBag size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.id)}
                              title="Von der Wunschliste entfernen"
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
                <Button variant="outline" onClick={() => navigate('/shop')}>Continue Shopping</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
