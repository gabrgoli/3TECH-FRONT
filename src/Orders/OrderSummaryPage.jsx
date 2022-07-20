import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CartList, OrderSummary } from '../Cart';
import NavBar from '../Components/NavBar'
import {useContext,useEffect,useState} from 'react'
import CartContext from '../Cart/CartContext'
import Cookie from 'js-cookie';
import axios from 'axios';
import {api} from '../actions'
import { useDispatch } from "react-redux";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import swal from 'sweetalert'

import {CREATEORDER, GETORDER} from '../actions'

export default function SummaryPage(){ // esta es la funcion principal
    const [user,setUser]=useState([])
    const navigate = useNavigate()    
    const dispatch= useDispatch();
    const { cart,total,removeAllCartProduct } = useContext(CartContext);
    const [userInfo,setUserInfo]=useState({})

    useEffect(()=>{ //si el carrito esta vacio no puede entrar a esta pagina
        if(!JSON.parse(Cookie.get('cart'))[0])navigate('/') //para refrescar la pagina, si esta vacio navega al home
        setUser(()=>Cookie.get('user')&&JSON.parse(Cookie.get('user')))
        
    },[])

    let order = {products:cart, adress: user?.adress,city:user?.city, isPaid: false, totalPrice: total }
    

    const crearOrden = async ()=> {
        if(!user?.adress){
            if(userInfo.adress&&userInfo.name&&userInfo.city){
            order = {products:cart,city:userInfo.city, adress: userInfo.adress, isPaid: false, totalPrice: total }
            let ordenNueva = await dispatch(CREATEORDER(order))
            dispatch(GETORDER(ordenNueva.payload)).then(()=>
            navigate(`/orderpayment/${ordenNueva.payload}`))
            removeAllCartProduct()
            }
            else{
                swal({
                    title:"Por favor complete sus datos",
                    text:"nop",
                    icon:"warning",
                    button:"Aceptar"
                })
            }
        }else{
            let ordenNueva = await dispatch(CREATEORDER(order))
            dispatch(GETORDER(ordenNueva.payload)).then(()=>
            navigate(`/orderpayment/${ordenNueva.payload}`))
            removeAllCartProduct()
        }
            
    }

    return(
           <>
        <NavBar/>
        <Typography variant='h4'  sx={{mt:15,fontWeight:20}} display='flex' justifyContent='center'> Resumen de la orden</Typography>
        <Divider sx={{m:1,marginX:'10%'}}/>
            <Grid container sx={{mt:3}}>
                <Grid item xs={12} sm={7}>

                     <CartList editable={false}/>  {/*COMPONENTE LISTA DEL CARRITO */}

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

                            
                            {user?.adress?
                            <Box>
                                <Typography>Nombre: {user?.name}</Typography>
                                <Typography>Direccion: {user?.adress}</Typography>
                                <Typography>Ciudad: {user?.city}</Typography>
                                <Typography>Telefono: {user?.phone}</Typography>
                            </Box>
                            :
                            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                <Box sx={{display:'flex',justifyContent:'center'}}>
                                <InfoOutlinedIcon color='error'/>
                                <Typography>Por favor completar sus datos para poder realizar la compra</Typography>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                    <TextField placeholder='Nombre del destinatario' variant='outlined' size='small' onChange={(e)=>setUserInfo((old)=>({...old,name:e.target.value}))}/>
                                    <TextField placeholder='Dirección de entrega' variant='outlined' size='small' onChange={(e)=>setUserInfo((old)=>({...old,adress:e.target.value}))}/>
                                    <TextField placeholder='Ciudad' variant='outlined' size='small' onChange={(e)=>setUserInfo((old)=>({...old,city:e.target.value}))}/>
                                </Box>
                            </Box>}

                            <Divider sx={{my:1}}/>

                            <Box display='flex' justifyContent='end'>
                                
                                <Link to="/cart">
                                    Editar
                                </Link>
                            </Box>

                            <OrderSummary/>

                            <Box sx={{mt:3}} >
            
                                    <Button color='secondary' className='circular-btn' fullWidth onClick={()=>crearOrden()}>
                                        Crear Orden
                                    </Button>                    

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
               
            </Grid>

            </>
    )
}
