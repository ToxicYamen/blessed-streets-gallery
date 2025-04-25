import { create } from 'zustand';

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
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
    cart: [],
    total: 0,
    addToCart: (item) =>
        set((state) => {
            const existingItem = state.cart.find((i) => i.id === item.id);
            if (existingItem) {
                const updatedCart = state.cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
                return {
                    cart: updatedCart,
                    total: updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                };
            }
            const newCart = [...state.cart, { ...item, quantity: 1 }];
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
    updateQuantity: (itemId, quantity) =>
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            );
            return {
                cart: updatedCart,
                total: updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
        }),
    clearCart: () => set({ cart: [], total: 0 }),
})); 