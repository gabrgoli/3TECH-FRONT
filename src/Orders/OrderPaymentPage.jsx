import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link, Chip,Container, CardMedia } from '@mui/material';
import { CartList, OrderSummary } from '../Cart';
import CartContext from '../Cart/CartContext'
import { BackspaceOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons,usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { GETORDER, PAYORDER,GETPRODUCTS } from '../actions';
import NavBar from '../Components/NavBar'
import Swal from 'sweetalert2/src/sweetalert2.js'
import swal from 'sweetalert';
import Cookie from 'js-cookie'
import { display } from '@mui/system';
import Sound from '../Pruebas/Audios'

const currency = "USD";



const OrderPage=()=>{

    const actualUser = Cookie.get('user') && JSON.parse(Cookie.get('user'))
    const dispatch1=useDispatch()
    
    const [{ options }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency]);




    const {id} = useParams()

    useEffect(()=>{
        dispatch1(GETORDER(id))
        dispatch1(GETPRODUCTS())
    },[])

    const order=useSelector((State) => State.rootReducer.order);
    const products=useSelector((State) => State.rootReducer.products);
    const [isPaid,setIsPaid]=useState(order.isPaid?true:false)
    const [isPaid2,setIsPaid2]=useState(false) //muestra o no los relampagos

/*
    const verificarSihayStock=(orden,productsBDD)=>{
    let verificacion=[true,'']
    orden.products.map((productOrder)=>(
        productsBDD.map((productBDD)=>(
            (productOrder._id===productBDD._id)&&
                (productOrder.stock>productBDD.stock)&&
                    (verificacion[0] = false),
                    (verificacion[1]=productBDD.name)
        ))
    ))
    return verificacion
    }
*/

    useEffect(()=>{
            order.isPaid && setIsPaid(()=>true)
    },[order])

        
        const onOrderCompleted = async( details ) => { //Funcion de verificar la COMPRA

        if ( details.status !== 'COMPLETED' ) {
            return alert('No hay pago en Paypal');
        }
    
        try { //realizo el pago
        
            dispatch1(PAYORDER({transactionId: details.id, orderId: order._id})).then((r)=>{
                if(r.payload?.message==='Orden pagada con éxito'){
                    console.log("res backend", r)
                    setIsPaid(()=>true)
                    setIsPaid2(()=>true)
                    
                    swal({
                        title:"Felicitaciones!!",
                        text:"Haz realizado el pago exitosamente",
                        icon:"success",
                        button:"Aceptar"
                    }).then(() =>  setIsPaid2(()=>false))
                }
                else{
                    swal({
                        title:`${r.payload?.message}`,
                        text:"Pago no realizado",
                        icon:"error",
                        button:"Aceptar"
                    })
                }
               
            })
    
        } catch (error) {
            //setIsPaying(false);
            swal({
                title:"Hubo un problema con el pago!!",
                text:"pago no realizado",
                icon:"error",
                button:"Aceptar"
            })
        }
      
       //window.location.reload();
     
    }
  
    return(
        
        // RELAMPAGOS SI isPaid2 es true
        isPaid2?    
        <div style={{ 
            backgroundImage: `url("https://tuderechoasaber.com.do/wp-content/uploads/2020/07/fuego.gif")`, 
            height:'100vh',
            marginTop:'-70px',
            fontSize:'50px',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            
            }}>
                <Sound reproducir={false} />
                <h1>halo</h1>
        </div>
        :  //si isPaid2 es false, muestra el resto
        <>  
            <NavBar/>
            <Sound reproducir={false} />


            <Box sx={{display:'flex',mt:15,alignItems:'center',justifyContent:'space-between',marginX:3}}>
              
            <Typography variant='h4'  sx={{fontWeight:20}}> Orden: {order._id}</Typography>
            {isPaid===false?
                    <Chip
                        sx={{my:2}}
                        label="Pendiente de pago"
                        variant='outlined'
                        color="error"
                        icon={ <CreditCardOffOutlined/>}
                    />

                    :<Chip
                        sx={{my:2}}
                        label="La orden ya fue pagada"
                        variant='outlined'
                        color="success"
                        icon={ <CreditScoreOutlined/>}
                    />
            }
            </Box>
            <Divider sx={{m:1,marginX:'10%'}}/>
                       

            <Grid container>


                <Grid item xs={12} sm={7}>
                    <CartList editable={false} order={order} orderIsPaid={isPaid}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen</Typography>
                            <Divider sx={{my:1}}/>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'> Dirección de entrega</Typography>
                               
                                    {/* <Link underline='always'>
                                        Editar
                                    </Link> */}
       
                            </Box>

                            
                            {order?.name&&<Typography>Nombre: {order?.name}</Typography>}
                            <Typography>Direccion: {order?.adress}</Typography>
                            <Typography>Ciudad: {order?.city}</Typography>

                            <Divider sx={{my:1}}/>

                            <Box display='flex' justifyContent='end'>
                                
                                    {/* <Link underline='always'>
                                        Editar
                                    </Link> */}

                               
                            </Box>

                            <OrderSummary/>

                            <Box sx={{mt:3}}>


{
                                isPaid?
                                <Chip
                                    sx={{my:2}}
                                    label="La orden ya fue pagada"
                                    variant='outlined'
                                    color="success"
                                    icon={ <CreditScoreOutlined/>}
                                />
                                :

                                (
                                 (actualUser?._id||0)!==order?.user?._id||0?
                                 <></>
                                 :
                                <PayPalButtons
                                disabled={false}
                                fundingSource={undefined}
                                createOrder={(data, actions) => {
                                    return actions.order
                                        .create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: currency,
                                                        value: order.totalPrice,
                                                    },
                                                },
                                            ],
                                        })
                                        .then((orderId) => {
                                            // Your code here after create the order
                                            return orderId;
                                        });
                                }}
                                onApprove={function (data, actions) {
                                    return actions.order.capture().then(function (details) {
                                        // Your code here after capture the order
                                        onOrderCompleted( details );
                                    });
                                }}
                            />)
                                }
                                       

                            </Box>                  
                        </CardContent>                   
                    </Card>
                </Grid> 
            </Grid>
        
            </>

        
    )
}

export default OrderPage;