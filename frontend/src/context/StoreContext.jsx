import { createContext, useReducer } from "react";

// Parse localStorage data safely
const parseLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    // Try to parse as JSON first
    try {
      return JSON.parse(item);
    } catch {
      // If JSON parsing fails, return the item as-is (for simple strings)
      return item;
    }
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const initialState = {
  cart: {
    cartItems: parseLocalStorage("cartItems", []),
    shippingAddress: parseLocalStorage("shippingAddress", {}),
    paymentMethod: parseLocalStorage(
      "paymentMethod",
      "Paiement à la livraison",
    ),
  },
  userInfo: parseLocalStorage("userInfo", null),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id && item.size === newItem.size,
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id && item.size === existItem.size
              ? newItem
              : item,
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) =>
          item._id !== action.payload._id || item.size !== action.payload.size,
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR": {
      localStorage.removeItem("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    case "USER_SIGNIN": {
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    }
    case "USER_SIGNOUT": {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "Paiement à la livraison",
        },
      };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export const Store = createContext();

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
