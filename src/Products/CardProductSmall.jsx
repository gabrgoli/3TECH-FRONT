import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea,Chip, IconButton,Box,Tooltip , Divider,Grid,Rating,CardActions } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
// import Swiper core and required modules
//import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import{useMemo,useState,useContext} from 'react'
//import { Swiper, SwiperSlide } from 'swiper/react';
import colorStyles from '../styles'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import  CartContext from '../Cart/CartContext';
import { ADDTOWISHLIST,DELETEFROMWISHLIST,GETPRODUCTREVIEWS } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function ProductCard({product,wishlist,setWishList}) {
  const [isHovered, setIsHovered] = useState (false);
  const [colorHeart, setColorHeart] = useState ('white');
  const {isAuthenticated}=useAuth0()
  const wishlistBDD=useSelector((state)=>state.rootReducer.wishList)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [productReviews,setProductReviews]=useState([])

  React.useEffect(()=>{
    dispatch(GETPRODUCTREVIEWS(product._id)).then(r=>setProductReviews(()=>r.payload))
  },[])

    const productImage = useMemo(()=>{
        return product?.imageProduct[1]?
        isHovered?
          `${product.imageProduct[1]}`
        : `${product.imageProduct[0]}`
        : `${product.imageProduct[0]}`
         
    },[isHovered,product.imageProduct])

    React.useEffect(()=>{
        setColorHeart(()=>'white')
        wishlist?.forEach((e)=>{
          if(e._id===product._id)setColorHeart(()=>'red')
        })
    },[wishlist])
    const { addProductToCart,cart} = useContext( CartContext )

    const [tempCartProduct, setTempCartProduct] = useState({
      _id: product._id,
      imageProduct: product.imageProduct,
      price: product.price,
      name: product?.name,
      category: product.category,
      quantity: 1,
      envio: product.envio,
      rating: product.rating,
      review: product.review,
      description: product.description,
      stock: product.stock,
      priceOriginal: product.priceOriginal||product.price,
      hasReview:0
    })

    const onUpdateQuantity = ( quantity ) => {
      setTempCartProduct( currentProduct => ({
        ...currentProduct,
        quantity
      }));
    }

    const addToWishList = () => { 
      if(colorHeart==="white"){
        setColorHeart("red")
        setWishList((old)=>[...old,product])
        dispatch(ADDTOWISHLIST({productId:product._id}))
      }
      else{
        setColorHeart("white")
        setWishList((old)=>old.filter(e=>e._id!==product._id))
        dispatch(DELETEFROMWISHLIST({productId:product._id}))
      }
      
    }


    const onAddProduct = () => {  
      //cuando uso addProductToCart me acttualiza tempCartProduct.quantity, 
      //entonces lo guardo en una variable cant y al final lo vuelvo a 
      //cargar con onUpdateQuantity(cant), esto me soluciona un bug del carrito, el cual me duplica la cantidad que 
      //coloca en el carrito cada vez que hago click      
       let cant = tempCartProduct.quantity 
       addProductToCart(tempCartProduct) //agrego el producto en el carrito
        cart.map( product => ( // mapeo todos los productos y si el stock es menor a la cantidad pedida lo aviso con alert y... 
          (product._id===tempCartProduct._id && product.quantity>=product.stock) && (product.quantity=product.stock,alert("Ese fue el último en Stock"))
        ))
        onUpdateQuantity(cant) //
   }


  return (
    <Card>
      
        <Box sx={{display:'flex',flexDirection:'row',bgcolor:colorStyles.color1,width:'100%',height:'40vw',marginY:2,boxShadow:'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;'}}> 
                <Box sx={{width:'30%',bgcolor:'white',border:`5px solid ${colorStyles.color1}`}}>
                  {product.priceOriginal && product.price!==product.priceOriginal ? <Chip  label={`-${(100-(product.price*100/product.priceOriginal)).toFixed(0)}%`} sx={{bgcolor:colorStyles.color2,position:'absolute'}}/>:<></>}
                    <CardMedia
                      component="img"
                      height='100%'
                      width='100%'
                      image={productImage}
                      alt="gf"
                      sx={{objectFit:'contain'}}
                      onClick={()=>{navigate(`/product/${product._id}`)}}>
                    </CardMedia>
                </Box >

                <Box sx={{display:'flex',flexDirection:'row',bgcolor:colorStyles.color1,width:'70%'}}>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',mt:2,ml:2}}>
                    <Link to = {'/product/'+product._id}>
                      <Box>
                        <Typography sx={{fontSize:'3.5vw',maxHeight:50, color:'white'}}>{product.name.length>60?product.name.slice(0,60)+'...':product.name}</Typography>
                      </Box>
                    </Link>
                      <Box>
                          {product.priceOriginal && product.price!==product.priceOriginal ?
                          <div>
                            <Typography sx={{fontSize:'5vw',maxHeight:50, color:'white'}}>{'$'+new Intl.NumberFormat().format(product.price)}</Typography>
                            <Typography sx={{fontSize:'3vw',maxHeight:50, color:'white'}}><del> ${new Intl.NumberFormat().format(product.priceOriginal)}</del></Typography>
                          </div>
                          :
                          <Typography sx={{fontSize:'5vw',maxHeight:50, color:'white'}} >${new Intl.NumberFormat().format(product.price)}</Typography> }
                      </Box>
                 
                      <Box sx={{width:'100%',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                        <Rating style={{ borderBlockColor:'white' }} readOnly defaultValue={product.rating} color='white' precision={0.1}/>
                        <Typography sx={{color:'white'}}>{productReviews.length}</Typography>
                        {isAuthenticated&&
                        <Tooltip title="Agregar a favoritos" placement="top">
                          <IconButton onClick={ addToWishList } style={{color: colorHeart}}>
                            <FavoriteIcon fontSize='small'/>
                          </IconButton>
                        </Tooltip> }
                        <CardActionArea>
                        <Tooltip title="Agregar al carrito" placement="top">
                          <IconButton  onClick={ onAddProduct } style={{color: "white"}}>
                            <AddShoppingCartIcon fontSize='small' sx={{ml:1}}/>
                          </IconButton>
                        </Tooltip>
                        </CardActionArea>
                      </Box>
                     
                    </Box>
          </Box>       
        </Box>
      
    </Card>
  );
}