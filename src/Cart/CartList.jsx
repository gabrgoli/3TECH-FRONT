import { useContext, useEffect,useState } from 'react';
//import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography, Chip, Card } from '@mui/material';
import  ItemCounter  from './ItemCounter.jsx';
import  CartContext  from './CartContext.jsx';
import { NavLink, useParams } from 'react-router-dom';
import { CreditScoreOutlined } from '@mui/icons-material';
import {api} from '../actions'
import axios from 'axios'
import Cookie from 'js-cookie'
import colorStyles from '../styles'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


import { useDispatch, useSelector } from "react-redux";
import {GETPRODUCTS} from '../actions'




export const CartList = ({ editable = false,order=false,orderIsPaid=false }) => {

    const dispatch=useDispatch()
    const {id} = useParams()

    useEffect(()=>{
        dispatch(GETPRODUCTS())
      },[dispatch])


    const productsBDD=useSelector((State) => State.rootReducer.products);
    const [BDD,setBDD]=useState([])
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);


    useEffect(()=>{
        setBDD(()=>productsBDD.map(e=>({
            _id:e._id,
            stock:e.stock
            })))
    },[productsBDD])
    
    const array=order.products || cart


    const onNewCartQuantityValue = (product, newQuantityValue) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product );
        const token=Cookie.get('token')
        var totalPrice=0
        cart.forEach((e)=>{
            totalPrice=totalPrice+e.price*e.quantity
        })
        axios.put(`${api}/cart`,{cart:cart,totalPrice},{ //modicia la base de datos
               headers:{
                  'x-access-token':token
               }
        }) 
    }

    return (
        <>
            {
                array?.map( product => (//product es un elemento del array cart
                    <Grid container spacing={2} key={ product._id } sx={{ mb:1 }}>
                        <Grid item xs={3}>
                            
                            <NavLink to={`/product/${ product._id }`} >
                               <Card >
                                    {<CardActionArea>
                                        <CardMedia 
                                            image={product.imageProduct?product.imageProduct[0]:"https://res.cloudinary.com/dnlooxokf/image/upload/v1651532672/sample.jpg"}
                                            component='img'
                                            sx={{ borderRadius: '5px',width: 150, height: 200, objectFit:'contain'}}
                                        />
                                    </CardActionArea> }
                                </Card>
                            </NavLink>
                        </Grid>



                        <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1' sx={{fontWeight:20}}>{ product.name }</Typography>
                                    { editable ? 
                                    ( 
                                        <ItemCounter 
                                            currentValue={ product.quantity }
                                            maxValue={ product.stock  } 
                                            updatedQuantity={ ( value ) => onNewCartQuantityValue(product, value )}
                                        />                           
                                    )
                                    : 
                                    (
                                        <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? 'productos':'producto' }</Typography>
                                    )                             
                                }
                                </Box>
                                <Box display='flex' flexDirection='column' >
                                    <Typography variant='h6'>{BDD.filter(e=>product._id===e._id)[0]?.stock } {'Disponibles'}</Typography>
                                   
                                   
                                    {!orderIsPaid?
                                        (product.quantity <= BDD.filter(e=>product._id===e._id)[0]?.stock) ?
                                        <Chip
                                        sx={{my:1, width:200}}
                                        label="En stock"
                                        variant='outlined'
                                        color="success"
                                        icon={ <CreditScoreOutlined/>}
                                        />
                                        :
                                        <Chip
                                        sx={{my:1, width:200}}
                                        label="No hay stock"
                                        variant='outlined'
                                        color="error"
                                        icon={ <CreditScoreOutlined/>}
                                        />:<></>
                                    }   
                                </Box>
                        
                        </Grid>

                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                         {/*mustro el porcentaje de descuento??*/}   
                        {product.priceOriginal && product.price!==product.priceOriginal ? <Chip label={`-${(100-(product.price*100/product.priceOriginal)).toFixed(0)}%`} sx={{bgcolor:colorStyles.color2}}/>:<></>}

                        {product.priceOriginal && product.price!==product.priceOriginal ?//muestro los dos precios, uno tachado?
                        <div>
                            {'$'+new Intl.NumberFormat().format(product.price)}
                            <Typography><del> ${new Intl.NumberFormat().format(product.priceOriginal)}</del></Typography>
                        </div>
                        :
                        new Intl.NumberFormat().format(product.price)}
                            
                        {editable && //saco el boton borrar si esta en las ordenes
                            (
                                <Button 
                                    variant='text' 
                                    color='secondary' 
                                    onClick={ () => removeCartProduct( product ) }
                                >
                                    Borrar
                                </Button>
                            )
                        }
                    </Grid>
                </Grid>
                ))
            }
        </>
    )
}