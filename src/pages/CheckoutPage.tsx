import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CheckoutPage = () => {
    const { cartItems: cart } = useCart();
    console.log('Cart items:', cart); // Debug-Logging
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Total:', total); // Debug-Logging
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: ''
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        // Hier kommt später die Zahlungslogik
        console.log('Processing payment:', paymentDetails);
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-mono-50 dark:bg-mono-950 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                        <Link to="/shop" className="text-accent hover:underline" data-navigation="true">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mono-50 dark:bg-mono-950 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center mb-8">
                    <Link to="/cart" className="text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-mono-100" data-navigation="true">
                        ← Back
                    </Link>
                    <h1 className="text-2xl font-bold ml-4">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Bestellübersicht */}
                    <div className="bg-white dark:bg-mono-900 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-mono-600 dark:text-mono-400">
                                            Size: {item.size}
                                        </p>
                                        <p className="text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-mono-200 dark:border-mono-800">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-4">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Zahlungsdetails */}
                    <div className="bg-white dark:bg-mono-900 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                                    Card Number
                                </label>
                                <Input
                                    id="cardNumber"
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentDetails.cardNumber}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="cardholderName" className="block text-sm font-medium mb-1">
                                    Cardholder Name
                                </label>
                                <Input
                                    id="cardholderName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={paymentDetails.cardholderName}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                                        Expiry Date
                                    </label>
                                    <Input
                                        id="expiryDate"
                                        type="text"
                                        placeholder="MM/YY"
                                        value={paymentDetails.expiryDate}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                                        CVV
                                    </label>
                                    <Input
                                        id="cvv"
                                        type="text"
                                        placeholder="123"
                                        value={paymentDetails.cvv}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
                                    Pay {formatPrice(total)}
                                </Button>
                            </div>

                            <p className="text-sm text-mono-600 dark:text-mono-400 text-center mt-4">
                                Your payment information is secure and encrypted
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 