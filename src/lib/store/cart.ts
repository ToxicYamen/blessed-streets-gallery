
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
    color?: string; // Added color property
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

const store = createStore<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            wishlistItems: [],

            addItem: (item) => {
                console.log('Adding item to cart:', item);
                set((state: CartStore) => {
                    const existingItem = state.items.find(
                        (i) => i.id === item.id && i.size === item.size
                    );
                    if (existingItem) {
                        console.log('Item exists, updating quantity');
                        return {
                            ...state,
                            items: state.items.map((i) =>
                                i.id === item.id && i.size === item.size
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    console.log('New item, adding to cart');
                    return {
                        ...state,
                        items: [...state.items, item]
                    };
                });
                console.log('Current cart:', get().items);
            },

            removeItem: (itemId, size) => {
                console.log('Removing item:', itemId, size);
                set((state: CartStore) => ({
                    ...state,
                    items: state.items.filter(
                        (item) => !(item.id === itemId && item.size === size)
                    ),
                }));
                console.log('Current cart:', get().items);
            },

            updateQuantity: (itemId, size, quantity) => {
                console.log('Updating quantity:', itemId, size, quantity);
                set((state: CartStore) => ({
                    ...state,
                    items: state.items.map((item) =>
                        item.id === itemId && item.size === size
                            ? { ...item, quantity }
                            : item
                    ),
                }));
                console.log('Current cart:', get().items);
            },

            clearCart: () => {
                console.log('Clearing cart');
                set((state) => ({ ...state, items: [] }));
                console.log('Current cart:', get().items);
            },

            getTotal: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            // Wishlist actions
            addToWishlist: (item) => {
                console.log('Adding item to wishlist:', item);
                set((state: CartStore) => {
                    const existingItem = state.wishlistItems.find(
                        (i) => i.id === item.id && i.size === item.size
                    );
                    if (existingItem) {
                        console.log('Item already in wishlist');
                        return state;
                    }
                    console.log('New item, adding to wishlist');
                    return {
                        ...state,
                        wishlistItems: [...state.wishlistItems, item]
                    };
                });
                console.log('Current wishlist:', get().wishlistItems);
            },

            removeFromWishlist: (itemId) => {
                console.log('Removing item from wishlist:', itemId);
                set((state: CartStore) => ({
                    ...state,
                    wishlistItems: state.wishlistItems.filter((item) => item.id !== itemId),
                }));
                console.log('Current wishlist:', get().wishlistItems);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export const useCartStore = () => useStore(store); 
