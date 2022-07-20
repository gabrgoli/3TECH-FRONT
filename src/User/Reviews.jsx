
import { useState, useEffect } from 'react';
import { DashboardOutlined, GroupOutlined, PeopleOutline } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem, Box,CardMedia,Typography,Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {MODIFYPRODUCT, GETORDERS,GETPRODUCTS,DELETEPRODUCT,SEARCHBYNAMEPRODUCTS,GETREVIEWS} from '../actions'
import { AppDispatch,RootState } from '../store'
import NavBar from '../Components/NavBar'
import SearchBar from '../Components/SearchBar'
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert'
import Rating from '@mui/material/Rating';
import Comment from './Comment'

const useAppDispatch = () => useDispatch();

const ProductsUserTable = () => {
    
    const dispatch=useAppDispatch()
    const navigate= useNavigate()

    const orders=useSelector((State) => State.rootReducer.orders);
    const reviews=useSelector((State) => State.rootReducer.reviews);
    const productsBDD=useSelector((State) => State.rootReducer.products); // para ver el estado del producto activo o bloqueado

    const [rows,setRows]=useState([])
    const [refreshRows,setRefreshRows]=useState(false)

    useEffect(()=>{
        dispatch(GETORDERS())
        dispatch(GETREVIEWS())
        dispatch(GETPRODUCTS()) //solo para saber el estado de los productos de la BDD
      },[dispatch,refreshRows])

      const productoIsActive = (productsBdd, product)=>{ //Estado de los productos
        let estado=true;
        productsBdd?.map((productBdd)=>(
            (productBdd._id===product._id)&&(estado=productBdd.isActive)
        ))
        return estado
    }

      useEffect(()=>{ //una vez que llegan las ordenes se llenana las rows
        const setRowsVariable=[]
        orders.filter(order=>order.isPaid===true).map((order)=>( //tomo solo ordenes pagas
            order.products.forEach((product)=>setRowsVariable.push({
                    id: product._id.concat(order._id), //genero un id unico para el grid
                    productId: product._id,
                    order:order,
                    orderId:order._id,
                    name:product.name,
                    price: `$${product.price}`,
                    image: product.imageProduct[0],
                    date:order.creationDate||"sin fecha en BDD", //fecha de compra
                    //review:product.rating? product.rating : "no tiene rating",
                    usuario:order.user,
                    producto:product,
                    hasReview:product?.hasReview||0,
                    status: productoIsActive(productsBDD,product)
             }))   
        )
        )
        setRows(()=>setRowsVariable||[])
    },[orders])




    const productosReviewArray=orders.products?.map(product=>( //esto es para cargar el estado productState
        {//id:product._id,
        isActive:product.isActive}
    ))
    const [productState,setProductState]=useState([])
   
    useEffect(()=>{ //eto es para actualizar el estado del producto cuando se pone bloqueado 
        setProductState(()=>productosReviewArray)
    },[orders])

   
    const handleChange=(e,row)=>{ //funcion que maneja el estado del producto
    
    



 }
    
    const columns = [
        { 
            field: 'img', 
            headerName: 'Foto',
            renderCell: ({ row } ) => {
                return (
                    <a href={ `/product/${ row.productId }` }  rel="noreferrer">
                        <CardMedia 
                            component='img'
                            alt=""
                            className='fadeIn'
                            image={ row.image }
                            sx={{  objectFit:'contain'}}
                        />
                    </a>
                )
            }
        },

        { 
            field: 'review', 
            headerName: 'Calificar', 
            width: 250,
            renderCell: ({ row } ) => {
                return (
                    
                  <Comment reviews={reviews} order={row.order} product={row.producto} func={()=>setRefreshRows((refresh)=>!refresh)}/>//producto es el producto de la orden

                )
            }
        },

        { field: 'name', headerName: 'Producto', width: 350 },
        { field: 'date', headerName: 'Fecha de compra', width: 250 },
        { field: 'price', headerName: 'Precio ($)', width: 250 },
        { field: 'orderId', headerName: 'Id de orden', width: 250 },
        { field: 'status', headerName: 'Estado', width: 250 }

    ];
    
  return (
<>
    <NavBar/>
    <Box mt={15} >
    <Typography variant='h2'>Reviews</Typography>
    <SearchBar 
                placeholder="buscar por nombre de producto"
                url='/user/reviews'
                dinamic={true}
                action={SEARCHBYNAMEPRODUCTS} //no funciona
        />






    <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height:900, width: 40000 }}>
            <DataGrid 
                rows={ rows }
                columns={ columns }
                pageSize={ 20 }
                rowsPerPageOptions={ [30] }
            /> 
        </Grid>          
    </Grid>





    </Box>
    </>
  )
}

export default ProductsUserTable