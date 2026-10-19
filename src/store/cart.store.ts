import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  cartKey: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface CartStore {
  cartItems: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (cartKey: string) => void;
  increaseQuantity: (cartKey: string) => void;
  decreaseQuantity: (cartKey: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      // Function that adds an item to cart
      addToCart: (item) => {
        const existing = get().cartItems.find(
          (cartItem) => cartItem.cartKey === item.cartKey,
        );

        if (existing) {
          set({
            cartItems: get().cartItems.map((cartItem) =>
              cartItem.cartKey === item.cartKey
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem,
            ),
          });

          return;
        }

        set({ cartItems: [...get().cartItems, item] });
      },
      // Function that increases the quantity of an item in cart
      increaseQuantity: (cartKey) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        });
      },
      // Function that decreases the quantity of an item in cart
      decreaseQuantity: (cartKey) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item,
          ),
        });
      },
      // Function that removes an item from cart
      removeFromCart: (cartKey) => {
        set({
          cartItems: get().cartItems.filter((item) => item.cartKey !== cartKey),
        });
      },
      // Function that clears the cart
      clearCart: () => {
        set({
          cartItems: [],
        });
      },
      // Function that returns the total items in cart
      totalItems: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      },
      // Function that returns the total price of all cart items
      subtotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
      skipHydration: true,
    },
  ),
);
