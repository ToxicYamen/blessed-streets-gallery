import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/lib/store/cart';

const CheckoutPage = () => {
    const { items } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: ''
    });

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Link to="/cart" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold ml-4">Checkout</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Size: {item.size}
                                    </p>
                                    <p className="text-sm">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{item.price.toFixed(2)} €</p>
                            </div>
                        ))}

                        <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-4">
                                <span>Total</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

                        <div className="flex w-full mb-6 space-x-4">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${paymentMethod === 'card'
                                    ? 'border border-black dark:border-white'
                                    : ''
                                    }`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="M3 10H21" />
                                </svg>
                                <span>Card</span>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex-1 flex items-center justify-center gap-2 ${paymentMethod === 'paypal'
                                    ? 'opacity-100'
                                    : 'opacity-50 hover:opacity-75'
                                    }`}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#00457C" d="M20.067 8.478c.492.315.844.825.844 1.522 0 1.845-1.534 3.845-3.534 3.845h-2.733L14 16.133H10.667L12 8.478h8.067zM4.011 16.133l1.267-7.655h2.733l-1.267 7.655H4.011zm4.263-7.655h8.067c.491.315.844.825.844 1.522 0 1.845-1.534 3.845-3.534 3.845h-2.733L10 16.133H6.667L8 8.478z" />
                                </svg>
                                <span>PayPal</span>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('klarna')}
                                className={`flex-1 flex items-center justify-center gap-2 ${paymentMethod === 'klarna'
                                    ? 'opacity-100'
                                    : 'opacity-50 hover:opacity-75'
                                    }`}
                            >
                                <div className="w-4 h-4 rounded-full bg-[#FFB3C7] flex items-center justify-center">
                                    <span className="text-black font-bold text-[10px]">K</span>
                                </div>
                                <span>Klarna</span>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-black dark:text-white text-sm mb-1">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-0 rounded-lg px-4 py-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cardholderName" className="block text-black dark:text-white text-sm mb-1">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="cardholderName"
                                        placeholder="John Doe"
                                        className="w-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-0 rounded-lg px-4 py-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                                        value={paymentDetails.cardholderName}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-black dark:text-white text-sm mb-1">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            placeholder="MM/YY"
                                            className="w-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-0 rounded-lg px-4 py-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                                            value={paymentDetails.expiryDate}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="cvv" className="block text-black dark:text-white text-sm mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            placeholder="123"
                                            className="w-full bg-white dark:bg-[#27272A] border border-gray-200 dark:border-0 rounded-lg px-4 py-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                                            value={paymentDetails.cvv}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className={`w-full font-medium rounded-lg py-2.5 mt-6 transition-colors ${paymentMethod === 'paypal'
                                ? 'bg-[#0070BA] hover:bg-[#003087] text-white'
                                : paymentMethod === 'klarna'
                                    ? 'bg-[#FFB3C7] hover:bg-[#FF8FAB] text-black'
                                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100'
                                }`}
                        >
                            {paymentMethod === 'card'
                                ? `Pay ${subtotal.toFixed(2)} €`
                                : paymentMethod === 'paypal'
                                    ? 'Continue with PayPal'
                                    : 'Continue with Klarna'
                            }
                        </button>

                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                            Your payment information is secure and encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 