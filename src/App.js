import './App.css';
/////////// PROVIDERS ///////////////

import { Route, Routes,Navigate } from 'react-router-dom';
import { PayPalScriptProvider} from "@paypal/react-paypal-js";
import  CartProvider  from './Cart/CartProvider';
import Cookie from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { GETWISHLIST } from './actions';
/////////// PROVIDERS FIN ///////////////

//////////////////////////////// RUTAS ///////////////////////////////////////

////home////
import Landing from './Pages/Landing';

////products////
import UploadProduct from './Products/UploadProduct'
import EditProduct from './Products/EditProduct'
import ProductDetails from './Products/ProductDetails';

////admin////
import Dashboard from './Admin/DashboardPage'
import ProductsTable from './Admin/ProductsTable'
import UserTable from './Admin/UsersTable'
import QuestionsTable from './Admin/QuestionsTable'

/// user ////
import Profile from './Pages/Profile'
import PasswordChange from './Pages/PasswordChange'
import Review from './User/Reviews'


/// payment & orders ////
import Cart from './Cart/CartPage.jsx'
import OrdersTable from './Admin/OrdersTable'
import OrderSummary from './Orders/OrderSummaryPage'
import OrderPayment from './Orders/OrderPaymentPage'
import EditOrder from './Orders/EditOrder'

//////////////////////////////// RUTAS FIN ///////////////////////////////////////

import Prueba from './Pruebas/LineChart'

function App() {
  const isLogged=Cookie.get('user')&&JSON.parse(Cookie.get('user')).email?true:false //estas logeado
  const isAdmin=Cookie.get('user')&&JSON.parse(Cookie.get('user')).role==='admin'?true:false
  const dispatch=useDispatch()
  const [wishlist,setWishList]=useState([])
  useEffect(()=>{
    Cookie.get('token')?dispatch(GETWISHLIST()).then((r)=>setWishList(()=>r.payload)):setWishList(()=>[])
  },[])
  return (

    <PayPalScriptProvider options={{ "client-id": 'AQ0xQs7KJfypFz2RqDQlSnT9qYlzBaGyXFsPaTVDQIbgpvD8n1TXUV5Qh-h6vzVdlzd4QjGDFdqOJrup' }}>
      <CartProvider>
        <Routes>
          <Route path='/' element={<Landing wishlist={wishlist} setWishList={setWishList}/>} />
          <Route path='/admin/uploadproduct' element={!isAdmin?<Navigate replace to='/'/>:<UploadProduct/>}/>
          <Route path='/admin/editproduct/:id' element={!isAdmin?<Navigate replace to='/'/>:<EditProduct/>}/>
          <Route path='/product/:id' element={<ProductDetails wishlist={wishlist} setWishList={setWishList}/>}/>
          <Route path='/profile' element={!isLogged?<Navigate replace to='/'/>:<Profile/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/admin/dashboard' element={!isAdmin?<Navigate replace to='/'/>:<Dashboard/>}/>
          <Route path='/admin/userstable' element={!isAdmin?<Navigate replace to='/'/>:<UserTable/>}/>
          <Route path='/admin/questionstable' element={!isAdmin?<Navigate replace to='/'/>:<QuestionsTable/>}/>
          <Route path='/orderstable' element={<OrdersTable/>}/>
          <Route path='/admin/productstable' element={!isAdmin?<Navigate replace to='/'/>:<ProductsTable/>}/>
          <Route path='/passwordchange' element={<PasswordChange/>}/>
          <Route path='/ordersummary' element={<OrderSummary/>}/>
          <Route path='/orderpayment/:id' element={<OrderPayment/>}/>
          <Route path='/orderedit/:id' element={<EditOrder/>}/>
          <Route path='/prueba' element={<Prueba/>}/>
          <Route path='/user/reviews' element={!isLogged?<Navigate replace to='/'/>:<Review/>}/>
        </Routes>
      </CartProvider>
    </PayPalScriptProvider>
    
  );
}

export default App;
