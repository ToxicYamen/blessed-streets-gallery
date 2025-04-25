import { createContext, useContext, ReactNode } from 'react';
import { useCartStore, CartItem } from '@/lib/store/cart';

interface CartContextType {
    cartItems: CartItem[];
    wishlistItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    addToWishlist: (item: CartItem) => void;
    removeFromWishlist: (id: string) => void;
    updateCartItemQuantity: (id: string, size: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const {
        items: cartItems,
        wishlistItems,
        addItem: addToCart,
        removeItem: removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist
    } = useCartStore();

    const updateCartItemQuantity = (id: string, size: string, quantity: number) => {
        updateQuantity(id, size, quantity);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                wishlistItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                addToWishlist,
                removeFromWishlist,
                updateCartItemQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 