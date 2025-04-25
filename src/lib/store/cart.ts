import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
}

interface CartState {
    items: CartItem[];
    wishlistItems: CartItem[];
}

interface CartActions {
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string, size: string) => void;
    updateQuantity: (itemId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    // Wishlist actions
    addToWishlist: (item: CartItem) => void;
    removeFromWishlist: (itemId: string) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            wishlistItems: [],

            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.id === item.id && i.size === item.size
                    );
                    if (existingItem) {
                        return {
                            ...state,
                            items: state.items.map((i) =>
                                i.id === item.id && i.size === item.size
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return {
                        ...state,
                        items: [...state.items, item]
                    };
                });
            },

            removeItem: (itemId, size) => {
                set((state) => ({
                    ...state,
                    items: state.items.filter(
                        (item) => !(item.id === itemId && item.size === size)
                    ),
                }));
            },

            updateQuantity: (itemId, size, quantity) => {
                set((state) => ({
                    ...state,
                    items: state.items.map((item) =>
                        item.id === itemId && item.size === size
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set((state) => ({ ...state, items: [] }));
            },

            getTotal: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            // Wishlist actions
            addToWishlist: (item) => {
                set((state) => {
                    const existingItem = state.wishlistItems.find(
                        (i) => i.id === item.id && i.size === item.size
                    );
                    if (existingItem) {
                        return state;
                    }
                    return {
                        ...state,
                        wishlistItems: [...state.wishlistItems, item]
                    };
                });
            },

            removeFromWishlist: (itemId) => {
                set((state) => ({
                    ...state,
                    wishlistItems: state.wishlistItems.filter((item) => item.id !== itemId),
                }));
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
); 