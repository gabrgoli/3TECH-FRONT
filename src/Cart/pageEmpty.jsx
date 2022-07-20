//import NextLink from 'next/link';

//import { ShopLayout } from "../../components/layouts/ShopLayout"
import { Box, Typography, Link } from '@mui/material';
import { RemoveShoppingCartOutlined } from "@mui/icons-material"



const EmptyPage=()=>{
    return(
        //<ShopLayout title="Carrito Vacio" pageDescription="No hay articulos ene el carrito de compras" imageFullUrl= {'any'}>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh-200px)'
                sx={{flexDirection:{xs:'column',sm:'row'}}}    
            >
                <RemoveShoppingCartOutlined sx={{fontSize:100}}/>
                <Box display='flex' flexDirection='column' alignItems='center' >
                    <Typography>Su Carrito esta vacio</Typography>
                    
                        <Link typography='h4' color='secondary '>
                            Regresar
                        </Link>
                   
                </Box>

            </Box>
        //</ShopLayout>
    )
}
export default EmptyPage