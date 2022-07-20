import { createContext } from 'react';



const obj= {
    cart:[],
    numberOfItems: 0,
    total: 0,

    // Methods
    addProductToCart: (product) => {},
    updateCartQuantity: (product) => {},
    removeCartProduct: (product) => {},
    removeAllCartProduct: (product) => {}
    // Orders
    //createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}


const CartContext = createContext(obj);

export default CartContext