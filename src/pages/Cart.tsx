import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { pageTransition } from '@/lib/transitions';
import { PageHeader } from '@/components/ui/PageHeader';

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId: string, size: string, change: number) => {
    const item = cartItems.find(item => item.id === itemId && item.size === size);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateCartItemQuantity(itemId, size, newQuantity);
      }
    }
  };

  const handleRemove = (itemId: string, size: string) => {
    removeFromCart(itemId, size);
    toast.success('Artikel wurde aus dem Warenkorb entfernt');
  };

  const handleCheckout = async () => {
    await pageTransition(() => {
      navigate('/checkout');
    });
  };

  return (
    <div>
      <PageHeader
        title="Cart"
        description="Dein Warenkorb"
      />
      <div className="pt-24">
        <div className="blesssed-container py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Link
              to="/shop"
              className="text-sm flex items-center gap-2 hover:text-accent transition-colors"
              data-navigation="true"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg mb-4">Dein Warenkorb ist leer</p>
                  <Link
                    to="/shop"
                    className="text-accent hover:underline"
                    data-navigation="true"
                  >
                    Zum Shop
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-6 p-4 bg-accent/5 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>Size: {item.size}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.size, -1)}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center border rounded-md transition-colors",
                              item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"
                            )}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.size, 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-accent transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.size)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <BackgroundGradient containerClassName="w-full h-fit">
                <div className="bg-white dark:bg-black p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{subtotal.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white dark:bg-white dark:text-black h-11 rounded-lg font-medium transition-all hover:scale-105"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
              </BackgroundGradient>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;