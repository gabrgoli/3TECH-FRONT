import {Box, Button, Card, CardContent, Divider, Grid,Typography} from '@mui/material';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import {  OrderSummary } from './OrderSummary';
import { CartList } from './CartList';
import NavBar from '../Components/NavBar'
import { useAuth0 } from '@auth0/auth0-react';
import swal from 'sweetalert';


const CartPage=()=>{
            
    const {isAuthenticated}=useAuth0()
    const navigate=useNavigate()
    return(
        <>
            <NavBar/>
            <Typography variant='h4'  sx={{mt:15,fontWeight:20}} display='flex' justifyContent='center'> Carrito</Typography>
            <Divider sx={{m:1,marginX:'10%'}}/>
            <Grid container sx={{mt:3}}>
                <Grid item xs={12} sm={7}>
                    <CartList editable/>
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{my:1}}/>

                            <OrderSummary/>
                            <Box sx={{mt:3}}>
                                <Button color='secondary' className='circular-btn' fullWidth onClick={()=>{
                                    if(!isAuthenticated){
                                        swal({
                                            title:"Por favor inicie sesión",
                                            text:"Para completar su compra es necesario iniciar sesión",
                                            icon:"warning",
                                            button:"Aceptar"
                                        })
                                    }else{
                                        navigate('/ordersummary')
                                    }
                                }}>
                                    Ir al checkout
                                </Button>

                            </Box>

                            
                        </CardContent>
                        
                    </Card>
                </Grid>

            </Grid>

            

 
       </>
    )
}

export default CartPage;