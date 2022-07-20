import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'
import { Container } from '@mui/system'
import * as React from 'react'
import CardProduct from '../Products/CardProduct'
import CardProductSmall from '../Products/CardProductSmall'
import NavBar from '../Components/NavBar'
import NavBarSmall from '../Components/NavBarSmall'
import { Autoplay,Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useDispatch, useSelector } from 'react-redux'
import { GETPRODUCTS } from '../actions'
import Loading from '../Components/Loading'
import OrderByPrice from '../Components/OrderByPrice'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import { useState } from 'react'
import Cookie from 'js-cookie'

const categories=['https://res.cloudinary.com/dnlooxokf/image/upload/v1654579315/images/jwupcxolofvkyfzrdvin.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579317/images/qgizpdigf71farfs88ae.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579317/images/wgwbatmjliclmqek0k5r.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579318/images/gstne4ffczw3e6zql5mh.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579318/images/x35mc8bzxto8bf4mkclm.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579318/images/s6wjxqzsxwcrvzua1oun.png','https://res.cloudinary.com/dnlooxokf/image/upload/v1654579319/images/ho68csnn5muuhecl33kj.png']
//const categories=['https://i.pinimg.com/originals/9f/5d/34/9f5d34242941aa388fc3ec559501543c.gif']
const Landing=({wishlist,setWishList})=>{

    const [nameCatg,setNameCatg]=React.useState('Productos')
    const dispatch=useDispatch()

    let products=useSelector((state)=>state.rootReducer.products)
    React.useEffect(()=>{
        if(!products[0])dispatch(GETPRODUCTS())
    },[dispatch, products])

    
    
    React.useEffect(()=> // Esto es para Que se muestre El titulo de la categoria que se  muestra
    {      
            var inicial='Productos'
            if(typeof products === "string"){ setNameCatg("")}//si es string es porque el back tira error, no encontro producto por ej
            else{
                var ref=products[0]?.category?.name
                setNameCatg(ref)
                products.forEach((e)=>{
                    if(e?.category?.name!==ref){  setNameCatg(inicial)}
                })
            }
    },[products])

    return(

            <Container sx={{mt:12,minWidth:'100%',p:{xs:0}}}>
                
                <Box sx={{display:{md:'none',xs:'flex'}}}><NavBarSmall wishlist={wishlist} setWishList={setWishList} /></Box>
                <Box sx={{display:{md:'flex',xs:'none'}}}><NavBar wishlist={wishlist} setWishList={setWishList} sx={{display:{xs:'none',md:'flex'}}}/></Box>
               
        {products[0]?<>
                <Box mt={15}>
                <Swiper 
                    modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={40}
                    slidesPerView={1}
                    navigation
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: true,
                      }}
                    loop
                >
                    {categories.map(e=>
                        <SwiperSlide key={e._id}>
                            <CardMedia
                            component="img"
                            height="auto"
                            image={e}
                            alt="gf"
                            sx={{objectFit:'contain'}}
                            key={e._id}
                            />
                        </SwiperSlide>)
                    }
                </Swiper>
                </Box>
                

                <Box sx={{marginX:4,mt:1,maxWidth:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography variant='h4' sx={{fontWeight:20,fontSize:{xs:20,md:30}}}>{nameCatg}</Typography>
                    <OrderByPrice/>
                </Box>
                        <Divider sx={{marginX:3}}/>

                {typeof products === "string" ? 
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',mt:3}}>
                    <Typography variant='h4' sx={{m:3}}>No hay productos con este nombre</Typography>
                </Box>
                :
                <Box>
                    {/* <Grid container   sx={{display:{xs:'none',md:'flex'},justifyContent:{xs:'space-around',md:'flex-start'},mt:2}}>  
                    {products.filter((e)=>e.isActive===true).map(e=>// para no mostrar cuando el producto esta bloqueado
                        <Grid key={e._id} md={3} sx={{display:'flex',justifyContent:'center'}}>

                            <CardProduct key={e._id} product={e} wishlist={wishlist} setWishList={setWishList}/>

                        </Grid>
                       )
                    }
                    </Grid> */}
                    <Box marginX={1} sx={{display:{xs:'flex',md:'none'},flexDirection:'column'}}>
                    {products.filter((e)=>e.isActive===true).map(e=>// para no mostrar cuando el producto esta bloqueado                   
                            <CardProductSmall key={e._id} product={e} wishlist={wishlist} setWishList={setWishList}/>
                       )
                    }
                    </Box>

                    <Grid container   sx={{display:{xs:'none',md:'flex'},justifyContent:{xs:'space-around',md:'flex-start'},mt:2}}>  
                    {products.filter((e)=>e.isActive===true).map(e=>// para no mostrar cuando el producto esta bloqueado       
                    <Grid key={e._id} md={3} sx={{display:'flex',justifyContent:'center'}}>            
                            <CardProduct key={e._id} product={e} wishlist={wishlist} setWishList={setWishList}/>
                    </Grid>
                       )  
                    }
                    </Grid>
                </Box>}

               
                </>:<Loading/>}
            </Container>

        
   
    )
}

export default Landing