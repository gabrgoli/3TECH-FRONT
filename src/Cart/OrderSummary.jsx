import { useContext, useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import { GETORDER } from '../actions';
import { useParams } from 'react-router-dom';
import CartContext from './CartContext';



export const OrderSummary = () => {
    const {id}=useParams()
    const dispatch=useDispatch()
    const {cart,total}=useContext(CartContext)
    const order=useSelector((state)=>state.rootReducer.order)
    const [array,setArray]=useState()

    const calcularCantidaddeProductosTotalesEnOrden = (order) =>{
        let contador = 0
        order?.products?.map((product)=>(
            contador = contador + product.quantity
        ))
        return contador      
    }

    useEffect(()=>{
        dispatch(GETORDER(id))
    },[dispatch,id])

    useEffect(()=>{    
        if(order.totalPrice)setArray(()=>[order])
        else{
            setArray(()=>cart)
        }
    },[order])
    // const items=order?order.products.length:numberOfItems
    // const amount=order?order.totalPrice:total
    console.log("array",array)
  return (
    array?
    
    <Grid container>
        
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{calcularCantidaddeProductosTotalesEnOrden(array[0])} { array[0]?.products?.length > 1 ? 'productos': 'producto' }</Typography>
        </Grid>



        <Grid item xs={6} sx={{ mt:2 }}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
          


          
            <Typography  variant="subtitle1">{ `$ ${new Intl.NumberFormat().format(array[0]?.totalPrice||total)}` }</Typography>
          
        </Grid>


    </Grid>:<h1>aaa</h1>
  )
}
