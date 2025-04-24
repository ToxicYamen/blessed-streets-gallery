import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { toast } from 'sonner';
interface CartItem extends Product {
  quantity: number;
  size: string;
}
const Cart = () => {
  // Mock cart data - in a real app, this would come from a state management solution
  const [cartItems, setCartItems] = useState<CartItem[]>([{
    id: "black-hoodie",
    name: "Blesssed Streets Logo Hoodie",
    price: 99.99,
    description: "Premium black hoodie featuring the iconic Blesssed Streets logo embroidery.",
    color: "black",
    images: ["/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png"],
    sizes: ["M", "L", "XL"],
    inventory: [{
      size: "M",
      quantity: 15
    }, {
      size: "L",
      quantity: 18
    }, {
      size: "XL",
      quantity: 10
    }],
    quantity: 1,
    size: "M",
    featured: true,
    isNew: true
  }]);
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? {
      ...item,
      quantity: newQuantity
    } : item));
  };
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const subtotal = calculateSubtotal();
  const shipping = 9.99;
  const total = subtotal + shipping;
  return <div className="pt-24">
      {/* Page Header */}
      <section className="bg-mono-800 py-[30px]">
        <div className="blesssed-container">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">SHOPPING CART</h1>
          <p className="text-mono-400 max-w-2xl">Review your items before proceeding to checkout.</p>
        </div>
      </section>
      
      {/* Cart Content */}
      <section className="py-[165px] bg-zinc-950">
        <div className="blesssed-container">
          {cartItems.length === 0 ? <div className="text-center py-20">
              <h2 className="text-2xl mb-4">Your cart is empty</h2>
              <p className="text-mono-400 mb-8">Explore our shop and add items to your cart.</p>
              <Link to="/shop">
                <Button>Explore Shop</Button>
              </Link>
            </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-mono-800">
                      <tr>
                        <th className="py-4 text-left">Product</th>
                        <th className="py-4 text-center">Quantity</th>
                        <th className="py-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mono-800">
                      {cartItems.map(item => <tr key={item.id}>
                          <td className="py-6">
                            <div className="flex items-center">
                              <div className="w-20 h-20 mr-4 overflow-hidden rounded-xl">
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <Link to={`/product/${item.id}`} className="font-medium hover:underline">
                                  {item.name}
                                </Link>
                                <p className="text-mono-400 text-sm mt-1">Color: {item.color} | Size: {item.size}</p>
                                <p className="text-mono-300 text-sm mt-1">${item.price.toFixed(2)}</p>
                                <button onClick={() => removeItem(item.id)} className="text-mono-500 text-sm mt-2 flex items-center hover:text-mono-300 transition-colors">
                                  <Trash2 size={14} className="mr-1" /> Remove
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center justify-center">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center border border-mono-700 rounded-full" disabled={item.quantity <= 1}>
                                <Minus size={14} />
                              </button>
                              <span className="mx-4 min-w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center border border-mono-700 rounded-full">
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="py-6 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <div className="bg-mono-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-mono-400">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mono-400">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-mono-700 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link to="/shop" className="text-mono-400 hover:text-mono-200 transition-colors flex items-center">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>}
        </div>
      </section>
    </div>;
};
export default Cart;