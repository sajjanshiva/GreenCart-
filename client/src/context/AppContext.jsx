import { dummyProducts } from "@/assets/assets";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // Set the base URL for axios from environment variables
axios.defaults.withCredentials = true; // Allow axios to send cookies with requests

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {          //wrap <app /> with <AppContextProvider> in main.jsx
    // This is a context provider that will provide the navigate function and user state to the entire application.

   const currency = import.meta.env.VITE_CURRENCY; // Get the currency from environment variables
    
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const[isSeller, setIsSeller] = useState(false);
    const[showUserLogin, setshowUserLogin] = useState(false);
    const[products, setProducts] = useState([]);

    const[cartItems, setCartItems] = useState({});
    const[searchQuery, setSearchQuery] = useState({});  

    const fetchSeller = async () => {
      try{
        const {data} = await axios.get('/api/seller/is-auth');
        if(data?.success){
          setIsSeller(true);
        }else{
          setIsSeller(false);
        }
      }catch(error){
        setIsSeller(false);
      }
    }

    //fetch user Auth status , User Data and cart items from backend
    const fetchUser = async () => {
      try{
        const {data} = await axios.get('/api/user/is-auth');
        if(data?.success){
          setUser(data.user);
          setCartItems(data.user.cartItems);
        }else{
          setUser(null);
        }
      }catch(error){
        setUser(null);
      }
    }

     //fetch all products from dummyProducts
    const fetchProducts = async () => {
      try{
      const {data} = await axios.get('/api/products/list');
      if(data.success){
        setProducts(data.products);
      }else{
        toast.error(data.message);
      }
      }catch(error){
        toast.error(error.message);
      }
    }

    //Add products to cart
    const addToCart = (itemId)=>{
      let cartData=structuredClone(cartItems);

      if(cartData[itemId]){
        cartData[itemId] += 1;
     }else{
        cartData[itemId] = 1;
      }
      setCartItems(cartData);
      toast.success("Item added to cart");
    }
    

    //update cart item Quantity

    const updateCartItem = (itemID, quantity)=>{
      let cartData =structuredClone(cartItems);

      cartData[itemID] = quantity;
      setCartItems(cartData);
      toast.success("Cart Updated");
      
    }

    //Remove from cart cart
    const removeCartItem = (itemId) => {
      let cartData = structuredClone(cartItems);
       if(cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
          delete cartData[itemId];
        }
      }
      toast.success("Removed from cart");
      setCartItems(cartData);
  }



     //Get Cart Items Count

     const getCartCount = () => {
      let totalCount = 0;
      for(const item in cartItems){
        totalCount += cartItems[item];
      }
      return totalCount;
     }

     //get Cart total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for(const items in cartItems){
      let itemInfo =products.find((product) => product._id === items);
      if(cartItems[items] > 0){
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100; // Round to 2 decimal places
  }
  

    useEffect(() =>{
      fetchUser();
      fetchSeller();  //check if seller is logged in when the app loads
     fetchProducts();  //fetch products from dummyProducts when the app loads
     }, []);

    // to update cart items in backend when cartItems state changes
     useEffect(() => {
      const updateCart = async () => {
        try{
          const {data} = await axios.post('/api/cart/update', {cartItems});
          if(!data.success){
            toast.error(data.message);
          }
        }catch(error){
          toast.error(data.message);
        }
      }
      
      if(user){
        updateCart();
      }
         
     },[cartItems]);


    const value = {navigate, user, setUser, isSeller, setIsSeller,
      showUserLogin,setshowUserLogin,products, currency,addToCart,updateCartItem,removeCartItem,
       cartItems,searchQuery, setSearchQuery, getCartCount, getCartAmount,axios,fetchProducts,setCartItems
  }; 

  return (
    <AppContext.Provider value={value}>
      {children}                           
    </AppContext.Provider>
  );
}

export const useAppContext = () => {         //custom hook to use the AppContext
    return useContext(AppContext);           // This allows all components inside children (like <App /> and everything under it)
}                                            //  to use the context value by calling
                                             //const { navigate, user, setUser, isSeller } = useAppContext();


