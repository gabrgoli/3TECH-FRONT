import * as React from 'react'
import { Container,Box } from '@mui/system'
import NavBar from '../Components/NavBar'
import { Divider, Typography,Chip,Rating, IconButton,CardMedia,Avatar, Tooltip,FormControlLabel, Checkbox } from '@mui/material'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import colorStyles from '../styles'
import ProductCard from './CardProduct'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import  CartContext from '../Cart/CartContext';
import ItemCounter from '../Cart/ItemCounter';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../Components/Loading'
import { GETPRODUCT,ADDTOWISHLIST,DELETEFROMWISHLIST,GETRECOMMENDED,GETPRODUCTREVIEWS,GETPRODUCTQUESTIONS} from '../actions';
import Comment from '../Components/Comment'
import Cookie from 'js-cookie'
import { useAuth0 } from '@auth0/auth0-react';

const ProductDetails=({wishlist,setWishList})=>{

    const {isAuthenticated}=useAuth0()
    const product=useSelector((state)=>state.rootReducer.detail)
   const [colorHeart, setColorHeart] = useState ();

    const actualUser = Cookie.get('user') && JSON.parse(Cookie.get('user'))
    const dispatch=useDispatch()
    
    const isAdmin=useSelector((state)=>state.rootReducer.isAdmin)
    const productReviews=useSelector((state)=>state.rootReducer.productReviews)
    const [comments,setComments]=useState([])
    const recommended=useSelector((state)=>state.rootReducer.recommended)
    const [loaded,setLoaded]=React.useState(false)
    const [checked,setChecked]=React.useState(false)
    const {id}=useParams() //traigo el id del producto
    const [tempCartProduct, setTempCartProduct] = useState({})

    React.useEffect(()=>{
        let isinlist = false
        wishlist?.forEach((e)=>{
          if(e._id===product._id)isinlist=true
        })
        setColorHeart(()=>isinlist===true?'red':'black')
    },[wishlist])


    React.useEffect(()=>{
        window.scrollTo(0, 0)
        dispatch(GETPRODUCT(id)).then(()=>
        dispatch(GETPRODUCTQUESTIONS(id))).then((r)=>setComments(()=>r.payload)).then(()=>
        dispatch(GETPRODUCTREVIEWS(id))).then(()=>
        dispatch(GETRECOMMENDED(id))).then(()=>setLoaded(true))

    },[dispatch,id])


    
    console.log("wishlist",wishlist)
    console.log("product",product)

    React.useEffect(()=>setTempCartProduct(()=>({
        _id: product._id,
        imageProduct: product.imageProduct,
        price: product.price,
        name: product.name,
        category: product.category,
        quantity: 1,
        envio: product.envio,
        rating: product.rating,
        review: product.review,
        description: product.description,
        stock: product.stock,
        hasReview:0
      })),[product])
      
    const typo=(texto)=>{
        return(
            <Typography sx={{m:1,p:1,ml:3}}>{texto}</Typography>
        )
    }
    const divider=()=>{
        return(
            <Divider sx={{marginX:3}}/>
        )
    }

    const { addProductToCart,cart} = useContext( CartContext )


    
      const onUpdateQuantity = ( cantidad ) => {
        setTempCartProduct( currentProduct => ({
          ...currentProduct,
          quantity: cantidad
        }));
      }

    const onAddProduct = () => {  
      //cuando uso addProductToCart me acttualiza tempCartProduct.quantity no se porque, 
      //entonces lo guardo en una variable y al final lo vuelvo a 
      //asignar con onUpdateQuantity(cant), esto me soluciona un bug del itemCounter      
        let cant = tempCartProduct.quantity 
        addProductToCart(tempCartProduct) //agrego el producto en el carrito
        cart.map( product => ( // mapeo todos los productos y si el stock es menor a la cantidad pedida lo aviso con alert y... 
            (product._id===tempCartProduct._id && product.quantity>=product.stock) && (product.quantity=product.stock,alert("no hay stock"))
        ))
        onUpdateQuantity(cant) //solamente dejo que hayan pedidos la cantidad de productos en stock, aca seteo el
   }

   const addToWishList = () => { 
    if(colorHeart==="black"){
     
      setWishList((old)=>[...old,product])
      dispatch(ADDTOWISHLIST({productId:product._id}))
     // setColorHeart("red")
    }
    else{
      
      setWishList((old)=>old.filter(e=>e!==product))
      dispatch(DELETEFROMWISHLIST({productId:product._id}))
     // setColorHeart("black")
    } 
  }

    return (
       
        <Container sx={{mt:15}}>
            <NavBar wishlist={wishlist} setWishList={setWishList}/>
            {loaded?
            <>
            <Box sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'space-between',flexDirection:{xs:'column',md:'row'},borderRadius:3,alignItems:'center'}}>
             
                <Container sx={{width:{xs:'100%',md:'50%'},height:'50%',display:'flex',alignItems:'center',marginY:3}}>
                <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={40}
                slidesPerView={1}
                navigation
                >
                {product.imageProduct.map(e=><SwiperSlide>
                    <CardMedia
                    component="img"
                    height="400"
                    image={e}
                    alt="gf"
                    sx={{objectFit:'contain'}}
                    />
                </SwiperSlide>)}
                </Swiper>
                </Container>


                <Box sx={{flexDirection:'column',width:{xs:'100%',md:'50%'}}}>
                    <Box sx={{flexDirection:'column'}}>
                        <Box sx={{m:1,border:'1px solid lightgray',p:3,pt:1,borderRadius:5}}>
                            <Box sx={{display:'flex',justifyContent:'space-between'}}>

                                {/* AGREGAR A FAVORITOS */}
                                {isAuthenticated&&
                                <Tooltip title="Agregar a favoritos" placement="top">
                                    <IconButton onClick={ addToWishList } style={{color: colorHeart}}>
                                        <FavoriteIcon />
                                    </IconButton>
                                </Tooltip> }

                                {/* TITULO DEL PRODUCTO */}
                                <Tooltip title={product.name} placement='top'>
                                    <Typography sx={{fontSize:{xs:20,sm:30},maxHeight:150}}>{product.name.length>35?product.name.slice(0,35)+'...':product.name}</Typography>
                                </Tooltip>

                                {/* BOTON AGREGAR AL CARRITO */}
                                {product.isActive && product.stock>0?
                                <IconButton 
                                    sx={{bgcolor:colorStyles.color2,borderRadius:3,fontSize:{xs:10,sm:15},color:'black',height:50}}
                                    onClick={ onAddProduct }
                                >
                                    Agregar al carrito 
                                    <AddShoppingCartIcon sx={{ml:1}}/>
                                </IconButton>
                                :
                                <Chip label= {`Sin Stock`} sx={{m:3}} color='error'/>}
                            </Box>

                            

                            <Box display='flex' flexDirection='row'>
                                <Box>
                                    {/* PRECIO DEL PRODUCTO INICIO */}
                                {product.priceOriginal && product.price!==product.priceOriginal ?
                                    <div>
                                        <Typography variant='h5' sx={{mt:1,fontWeight:12}}>{'$'+new Intl.NumberFormat().format(product.price)} </Typography>
                                        <Typography><del> ${new Intl.NumberFormat().format(product.priceOriginal)}</del></Typography>
                                    </div>
                                    :
                                    <Typography variant='h5' sx={{mt:1,fontWeight:12}}> {'$'+new Intl.NumberFormat().format(product.price)} </Typography>}   
                                    {/* PRECIO DEL PRODUCTO FIN */}               
                                </Box>
                                <Box display='flex' justifyContent="end">
                                    {/* PORCENTAJE DE DESCUENTO SI ES QUE EXISTE */}   
                                    {product.priceOriginal && product.price!==product.priceOriginal ? <Chip label={`-${(100-(product.price*100/product.priceOriginal)).toFixed(0)}%`} sx={{bgcolor:colorStyles.color2}}/>:<></>}
                                </Box>
                            </Box>
                                    {/* ITEM COUNTER */}         
                                <Box sx={{my:2,display:'flex',alignItems:'center',justifyContent:'left'}}>
                                    <Typography variant='subtitle2'>Cantidad </Typography>
                                    <ItemCounter 
                                        currentValue={ tempCartProduct.quantity }
                                        maxValue={ product.stock }
                                        updatedQuantity={ (value)=>onUpdateQuantity(value)  } 
                                    />
                                </Box>

                            {/*DESCRIPCION DEL PRODUCTO*/}   
                            <Typography overflow={'auto'} variant='body1' sx={{mt:2,maxHeight:200}}>{product.description}</Typography>


                            
                        </Box>
                    </Box>
                   

                    <Box sx={{flexDirection:'column',p:0}}>
                        <Box sx={{m:1,border:'1px solid lightgray',borderRadius:5}}>
                            {/* {typo('Marca: Apple')}
                            {divider()}
                            {typo('Modelo: 11')}
                            {divider()}
                            {typo('Color: Violeta')}
                            {divider()} */}

                            {/* MUESTRA EL STOCK DEL PRODUCTO */}
                            <Box sx={{display:'flex',alignItems:'center'}}> 
                                {typo(`Stock:`)}
                                {product.stock>0?
                                <Chip label= {`${product.stock} en Stock`} sx={{bgcolor:colorStyles.color2}}/>
                                :
                                <Chip label= {`Sin Stock`} color='error'/>}
                            </Box>

                            {divider()}

                            {/* VALORACION GENERAL DEL PRODUCTO */}
                            <Box sx={{display:'flex',alignItems:'center'}}>
                                {typo('Valoracion: ')}
                                <Rating readOnly defaultValue={product.rating} precision={0.1}/>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Box>

            {productReviews.length>0&&
                <Box sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'space-between',flexDirection:'column',borderRadius:3,mt:4,mb:3}}>
                    <Typography sx={{fontSize:{xs:15,md:30},m:2,ml:4}}>Valoraciones</Typography>
                    {divider()}

                    
                    <Container component="div" sx={{ overflow: 'auto',mb:2,maxHeight:400,mt:2 }}>{/* VALORACIONES */}
                        {productReviews?.map((productReview)=>(
                            <Box display='flex' sx={{flexDirection:'column'}}>
                                <Box display='flex' flexDirection='column' alignItems='flex-start' justifyContent='center'>
                                    <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                        <Avatar src={productReview.user.avatar} alt={productReview.user.email}/>
                                        <Typography ml={1}>{productReview.user.email}</Typography>
                                    </Box>
                                    <Box display='flex' mt={1}>
                                        <Rating  readOnly defaultValue={productReview.review} precision={0.1}/>
                                    </Box>
                                    
                                    
                                </Box>
                                <Box mb={1}>
                                    {productReview.comment&&<Typography variant='body1' sx={{mt:2,maxHeight:200}}>"{productReview.comment}"</Typography>}    
                                </Box>
                            <Divider sx={{marginX:3,marginY:3}}/>
                            </Box>
                    
                        ))
                        }
                </Container>
                    

                </Box>
            }

            <Box sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'space-between',flexDirection:'column',borderRadius:3,mt:4,mb:3}}>
                <Box sx={{display:'flex'}}>
                    <Typography sx={{fontSize:{xs:15,md:30},m:2,ml:4}}>Preguntas al vendedor</Typography>
                    {isAdmin&&<FormControlLabel
                        label="Mostrar solo preguntas sin responder"
                        control={<Checkbox checked={checked} onChange={()=>setChecked((prev)=>!prev)} />}
                    />}
                </Box>
                {divider()}

                
                <Container component="div" sx={{ overflow: 'auto',mb:2,maxHeight:400 }}>{/* PREGUNTAS Y RESPUESTAS */}
                    {comments?.filter((comment)=>{
                        if(checked) return !comment?.replies[0]  //Filtra solo los comentarios sin respuestas
                        else return comment
                    }).map((comment)=>(
                        <Box display='flex' sx={{flexDirection:'column'}}>
                            <Box mb={1}>
                                <Typography variant='body1' sx={{mt:2,maxHeight:200}}>"{comment.comment}"</Typography> 
                                
                                {isAdmin&&!comment?.replies[0]?<Comment product={product} question={comment} isAdmin={isAdmin} user={actualUser} setComments={setComments}/>:<></>}

                                <Typography variant='body1' sx={{mt:2,maxHeight:200}}>{comment?.replies[0]?.comment||comment?.replies[0]?.body}</Typography> 
                            </Box>
                        <Divider sx={{marginX:3,marginY:3}}/>
                        </Box>
                
                    ))
                    }

                    
                </Container>
                <Divider flexItem/>
               <Box>{isAdmin?  //Boton pop up Cartel de pregunta, solo para usuarios
                    <></>:
                        actualUser?.name?
                        <Comment product={product} textButton='Hacer una pregunta' user={actualUser} setComments={setComments}/>
                        :<Box sx={{display:'flex',justifyContent:'center'}}>
                        <Typography sx={{fontWeight:40,m:3}}>Inicia sesion para hacer preguntas sobre este producto</Typography>    
                        </Box>}
               </Box>
                
            </Box>


            <Box sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'space-between',flexDirection:'column',borderRadius:3,mt:4,mb:3}}>
                <Typography sx={{fontSize:{xs:15,md:30},m:2,ml:4}}>Productos Relacionados</Typography>
                {divider()}
                <Container sx={{mb:2}}>
                <Swiper
                breakpoints= {{
                    300: {
                      slidesPerView: 2,
                      spaceBetween: 5,
                    },
                    900: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                      }
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                >
                {recommended.filter((e)=>e.isActive===true).map(e=><SwiperSlide><ProductCard product={e} wishlist={wishlist} setWishList={setWishList}/></SwiperSlide>)}
            </Swiper>
                </Container>
            </Box>
            </>:<Loading/>}
        </Container>
    )
}

export default ProductDetails