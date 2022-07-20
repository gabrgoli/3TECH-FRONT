import { Box, Button, Card, CardContent, Divider, Grid,Chip, Typography, CardActionArea, CardMedia, } from '@mui/material';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CartList, OrderSummary } from '../Cart';
import NavBar from '../Components/NavBar'
import {useContext,useEffect,useState} from 'react'
import CartContext from '../Cart/CartContext'
import Cookie from 'js-cookie';
import axios from 'axios';
import {api} from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import swal from 'sweetalert'
import { CreditScoreOutlined } from '@mui/icons-material';
import colorStyles from '../styles'
import ItemCounter from '../Components/ItemCounter'
import {EDITORDER, GETORDER} from '../actions'

export default function EditOrder(){ // esta es la funcion principal
    
    
    //const [inputOrder,setInputOrder]=useState({})
    const navigate = useNavigate()    
    const dispatch= useDispatch();
    const [BDD,setBDD]=useState([])
    const productsBDD=useSelector((State) => State.rootReducer.products);
    const {id}=useParams()

    const order=useSelector((state)=>state.rootReducer.order)
     let input = {products:"", adress: "", isPaid: false, totalPrice: order?.totalPrice }
    
     useEffect(()=>{
        dispatch(GETORDER(id))
    },[dispatch])


    const [inputOrder,setInputOrder]=useState({
        _id: order._id,
        totalPrice: order?.totalPrice,
        products:order?.products
      })

    useEffect(()=>{setInputOrder(()=>({
        _id:order._id,
        totalPrice:order.totalPrice,
        products:order.products                                                               
    }))
    },[order])

    //Para ver el Stock que tiene el producto en la BDD
    useEffect(()=>{
        setBDD(()=>productsBDD.map(e=>({
            _id:e._id,
            stock:e.stock
            })))
    },[productsBDD])



console.log("order",order)

    const editarOrden = async ()=> {
       // if(user.adress&&user.city&&user.phone){
            await dispatch(EDITORDER(order))
            navigate('/orderstable')
      //  }
        //else{
            // swal({
            //     title: "Por favor complete sus datos de entrega para realizar la compra",
            //     text: "",
            //     icon: "warning",
            //     buttons: ["Cancelar","Ir a mi perfil"]
            //   }).then((go) => {
            //     if (go)navigate('/profile')
            //   })
            
        //}
    }
    const [productInOrder, setproductInOrder] = useState({
        quantity: 2 
    })


    const onUpdateQuantity = ( quantity,productIn ) => {
        //console.log("inputOrder",inputOrder)
       
        let arrayProducts=order.products
        productIn.quantity=quantity
        arrayProducts.filter((product)=>(productIn._id!==product._id))
        arrayProducts.push(productIn)
        console.log("arrayProducts",arrayProducts)

       /* setInputOrder( currentProduct => ({
            ...currentProduct,
            products:arrayProducts
          }));
         */
      /*    orderState.totalPrice=0
          orderState?.products?.forEach((product)=>{
            or*derState?.totalPrice=orderState?.totalPrice+product.price*product.quantity
        })*/
      }


  /*    useEffect(()=>{
        var totalPrice=0
        order.products.forEach((product)=>{
          totalPrice=totalPrice+product.price*product.quantity
      })
    },[order])*/

      const calcularCantidaddeProductosTotalesEnOrden = (order) =>{
        let contador = 0
        order?.products?.map((product)=>(
            contador = contador + product.quantity
        ))
        return contador      
    }





    return(
           <>
        <NavBar/>
        <Typography variant='h4'  sx={{mt:15,fontWeight:20}} display='flex' justifyContent='center'> Editar la orden</Typography>
        <Divider sx={{m:1,marginX:'10%'}}/>
            <Grid container sx={{mt:3}}>
                <Grid item xs={12} sm={7}>


                    {/*COMPONENTE LISTA DEL CARRITO INICIO*/}
                    <>
            {
                inputOrder.products?.map( product => (//product es un elemento del array cart
                    <Grid container spacing={2} key={ product._id } sx={{ mb:1 }}>
                        <Grid item xs={3}>
                            
                            <NavLink to={`/product/${ product._id }`} >
                               <Card >
                                    <CardActionArea>
                                        <CardMedia 
                                            image={product.imageProduct?product.imageProduct[0]:"https://res.cloudinary.com/dnlooxokf/image/upload/v1651532672/sample.jpg"}
                                            component='img'
                                            sx={{ borderRadius: '5px',width: 150, height: 200, objectFit:'contain'}}
                                        />
                                    </CardActionArea> 
                                </Card>
                            </NavLink>
                        </Grid>



                        <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1' sx={{fontWeight:20}}>{ product.name }</Typography>

                                    
                                        <ItemCounter 
                                            currentValue={ product.quantity }
                                            maxValue={ product.stock  } 
                                            updatedQuantity={(value)=>onUpdateQuantity(value,product)}
                                        />                           
                                    
                         
                                
                                </Box>
                                <Box display='flex' flexDirection='column' >
                                    <Typography variant='h6'>{BDD.filter(e=>product._id===e._id)[0]?.stock } {'Disponibles'}</Typography>
                                   
                                
                                </Box>
                        
                        </Grid>

                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                         {/*mustro el porcentaje de descuento??*/}   
                        {product.priceOriginal && product.price!==product.priceOriginal ? <Chip label={`-${(100-(product.price*100/product.priceOriginal)).toFixed(0)}%`} sx={{bgcolor:colorStyles.color2}}/>:<></>}
                        {/* muestro los dos precios, uno tachado? */}
                        {product.priceOriginal && product.price!==product.priceOriginal ?
                        <div>
                            {'$'+new Intl.NumberFormat().format(product.price)}
                            <Typography><del> ${new Intl.NumberFormat().format(product.priceOriginal)}</del></Typography>
                        </div>
                        :
                        '$'+new Intl.NumberFormat().format(product.price)}
                            
                            
                                <Button 
                                    variant='text' 
                                    color='secondary' 
                                   // onClick={ () => removeCartProduct( product ) }
                                >
                                    Borrar
                                </Button>
                            
                        
                    </Grid>
                </Grid>
                ))
            }
        </>
                     {/*COMPONENTE LISTA DEL CARRITO FIN */}

                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h4' sx={{fontWeigth:20}}>Resumen</Typography>
                            <Divider sx={{my:1}}/>
                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'> Datos para la entrega:</Typography>
                                    <Button onClick={()=>navigate('/profile')}>
                                        Editar
                                    </Button>
                            </Box>

                            
                            {order.user?.adress&&order.user?.city&&order.user?.phone?
                            <Box>
                                <Typography>{order.user?.name}</Typography>
                                <Typography>{order.user?.adress}</Typography>
                                <Typography>{order.user?.city}</Typography>
                                <Typography>{order.user?.phone}</Typography>
                            </Box>
                            :
                            <Box sx={{display:'flex',justifyContent:'center'}}>
                                <InfoOutlinedIcon color='error'/>
                                <Typography>Por favor completar sus datos para poder realizar la compra</Typography>
                            </Box>}

                            <Divider sx={{my:1}}/>

                            <Box display='flex' justifyContent='end'>
                                
                                <Link to="/cart">
                                    Editar
                                </Link>
                            </Box>
                             {/*COMPONENTE RESUMEN DE ORDEN INICIO*/}


                            <Grid container>

                            <Grid item xs={6}>
                            <Typography>No. Productos</Typography>
                            </Grid>
                            <Grid item xs={6} display='flex' justifyContent='end'>
                            <Typography>{calcularCantidaddeProductosTotalesEnOrden(order)} { order?.products?.length > 1 ? 'productos': 'producto' }</Typography>
                            </Grid>



                            <Grid item xs={6} sx={{ mt:2 }}>
                            <Typography variant="subtitle1">Total:</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>




                            <Typography  variant="subtitle1">{ `$ ${new Intl.NumberFormat().format(inputOrder.totalPrice)}` }</Typography>

                            </Grid>


                            </Grid>


                            {/*COMPONENTE RESUMEN DE ORDEN FIN */}

                            <Box sx={{mt:3}} >
            
                                    <Button color='secondary' className='circular-btn' fullWidth onClick={()=>editarOrden()}>
                                        Guardar cambios
                                    </Button>                    

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
               
            </Grid>

            </>
    )
}
