
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

interface CartItem {
    id: string;
    name: string;
    price: number;
    images: string[];
    size: string;
    color: string;
    quantity: number;
}

interface CartStore {
    cart: CartItem[];
    total: number;
    addToCart: (item: CartItem, maxQuantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number, maxQuantity: number) => void;
    clearCart: () => void;
}

const store = createStore<CartStore>((set) => ({
    cart: [],
    total: 0,
    addToCart: (item, maxQuantity) =>
        set((state) => {
            const existingItem = state.cart.find((i) => i.id === item.id);
            if (existingItem) {
                // Don't add more than what's in stock
                const newQuantity = Math.min(existingItem.quantity + 1, maxQuantity);
                const updatedCart = state.cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                );
                return {
                    cart: updatedCart,
                    total: updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                };
            }
            // For new items, make sure we don't add more than what's in stock
            const safeQuantity = Math.min(1, maxQuantity);
            const newCart = [...state.cart, { ...item, quantity: safeQuantity }];
            return {
                cart: newCart,
                total: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
        }),
    removeFromCart: (itemId) =>
        set((state) => {
            const newCart = state.cart.filter((item) => item.id !== itemId);
            return {
                cart: newCart,
                total: newCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
        }),
    updateQuantity: (itemId, quantity, maxQuantity) =>
        set((state) => {
            // Ensure we don't exceed the maximum stock
            const safeQuantity = Math.min(quantity, maxQuantity);
            const updatedCart = state.cart.map((item) =>
                item.id === itemId ? { ...item, quantity: safeQuantity } : item
            );
            return {
                cart: updatedCart,
                total: updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
        }),
    clearCart: () => set({ cart: [], total: 0 }),
}));

export const useCart = () => useStore(store); 
