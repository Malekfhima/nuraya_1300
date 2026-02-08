// 🔐 Sécurisation de localStorage (évite erreurs SSR + JSON corrompu)
const safeParse = (key) => {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined") return null;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Erreur localStorage (${key})`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const initialState = {
  userInfo: safeParse("userInfo"),
  cart: {
    cartItems: safeParse("cartItems") || [],
    shippingAddress: safeParse("shippingAddress") || {},
    paymentMethod:
      (typeof window !== "undefined" &&
        localStorage.getItem("paymentMethod")) ||
      "Paiement à la livraison",
  },
};

export function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id && item.size === newItem.size
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id && item.size === existItem.size
              ? newItem
              : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) =>
          item._id !== action.payload._id || item.size !== action.payload.size
      );

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }

    case "CART_CLEAR":
      localStorage.removeItem("cartItems");
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };

    case "USER_LOGIN":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };

    case "USER_LOGOUT":
      ["userInfo", "cartItems", "shippingAddress", "paymentMethod"].forEach(
        (key) => localStorage.removeItem(key)
      );

      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "Paiement à la livraison",
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case "SAVE_PAYMENT_METHOD":
      localStorage.setItem("paymentMethod", action.payload);
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    default:
      return state;
  }
}
