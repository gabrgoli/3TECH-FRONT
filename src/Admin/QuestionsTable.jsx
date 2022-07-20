
import { useState, useEffect } from 'react';
import { DashboardOutlined, GroupOutlined, PeopleOutline } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem, Box,CardMedia,Typography,Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {MODIFYPRODUCT, GETALLQUESTIONS,GETPRODUCTS,DELETEPRODUCT,SEARCHBYNAMEPRODUCTS} from '../actions'
import { AppDispatch,RootState } from '../store'
import NavBar from '../Components/NavBar'
import SearchBar from '../Components/SearchBar'
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert'

const useAppDispatch = () => useDispatch();

const UsersPage = () => { //FUNCION PRINCIPAL
    

  
    const dispatch=useAppDispatch()
    const navigate= useNavigate()

    useEffect(()=>{
        dispatch(GETPRODUCTS())
        dispatch(GETALLQUESTIONS())
      },[dispatch])

    const [rows,setRows]=useState([])
    const products=useSelector((State) => State.rootReducer.products);
    const questions=useSelector((State) => State.rootReducer.allquestions);

    //DEVUELVE ARRAY CON TODOS LOS PRODUCTOS SIN RESPUESTA, PERO SI TIENE 2 PREGUNTAS SIN RESPONDER TOMA EL PRODUCTO 2 VECES
    let productsWithNoAnswers = (products) =>{
        let array= []
        products.map((product)=>(
            product.questions.filter((question)=>(
                (question.replies.length===0)&&array.push(product)
            ))
        ))
        return array
    }
    //PARA QUE NO SE REPITA EL ARRAY DE PRODUCTOS CON PREGUNTAS SIN RESPONDER
    let productsWithNoAnswersNoRepeat = productsWithNoAnswers(products).filter((order,index)=>{
        return productsWithNoAnswers(products).indexOf(order) === index;
    })


    console.log("questions",questions)
    
    useEffect(()=>{ //una vez que llegan los productos se llenana las rows
        setRows(()=>productsWithNoAnswersNoRepeat.map( (product) => ({
            id: product._id,
            name: product.name,
            price: `$${product.price}`,
            stock: product.stock,
            image: product.imageProduct[0],
            estado: product.isActive,
            date:product.creationDate||"sin fecha en BDD",
            rating:product.rating? product.rating : "no tiene rating",
            totalQuestions: product.questions.length,
            totalQuestionsNoAnswer: calcularCantidadDePreguntasSinRespuesta(questions,product),
        })))
    },[dispatch,products])

    const productosmap=products.map(product=>( //esto es para cargar el estado productState
        {id:product._id,
        isActive:product.isActive}
    ))
    const [productState,setProductState]=useState([])
   
    useEffect(()=>{ //eto es para actualizar el estado del producto cuando se selecciona bloqueado 
        setProductState(()=>productosmap)
    },[products])


      const deleteOrder=async(row)=>{
        swal({
            title: "Estas seguro que deseas eliminar el producto?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {

             dispatch (DELETEPRODUCT(row.id)).then((r)=>{
                 if(r.payload.message==='Product successfully deleted'){
                    setRows((state)=>state.filter(e=>
                        e.id!==row.id
                    ))
                    //   swal("has eliminado la orden!", { icon: "success",});
                 }
             })
     
            } else {//si presiona  cancel
            }
          });
    }

    const calcularCantidadDePreguntasSinRespuesta = (questions,product)=>{
        let contador = 0;
        questions.map((question)=>(
            ((question.product._id===product._id)&&(question.replies.length===0))&&(contador= contador+1)       
        ))
        return contador
      }
    
    const columns = [
        { 
            field: 'img', 
            headerName: 'Foto',
            
            renderCell: ({ row } ) => {
                return (
                    <a href={ `/product/${ row.id }` } target="_blank" rel="noreferrer">
                        <CardMedia 
                            component='img'
                            alt=""
                            className='fadeIn'
                            image={ row.image }
                            sx={{objectFit:'contain'}}
                        />
                    </a>
                )
            }
        },

        { field: 'totalQuestions', headerName: 'Preguntas totales', width: 250 },
        { field: 'totalQuestionsNoAnswer', headerName: 'Preguntas Sin responder', width: 250 },

        { field: 'name', headerName: 'Producto', width: 350 },
        { field: 'date', headerName: 'Fecha de publicacion', width: 250 },
        { field: 'rating', headerName: 'calificacion de usuarios', width: 250 },
        { field: 'price', headerName: 'Precio ($)', width: 250 },
        { field: 'stock', headerName: 'En stock', width: 250 },
        { field: 'status', 
            headerName: 'Estado', 
            width: 300,
            renderCell: ({row}) => {
                return (
                        <Select
                            value={ productState.filter(e=> e.id===row.id)[0]?.isActive?'online':'bloqueado' }
                            label="state"
                            //onChange={(e)=>handleChange(e,row) }
                            sx={{ width: '300px' }}
                        >
                            <MenuItem value='online'> online </MenuItem>
                            <MenuItem value='bloqueado'> bloqueado </MenuItem>
                            <MenuItem onClick={(e)=> deleteOrder(row)} display='flex' flexDirection='center' color='red'  >Eliminar</MenuItem>
                        </Select>
                )
            }
        },
    ];
    
  return (
<>
    <NavBar/>
    <Box mt={15} >
    <Typography variant='h2'>PREGUNTAS SIN RESPONDER</Typography>
    <SearchBar 
                placeholder="buscar por nombre de producto"
                url='/admin/userstable'
                dinamic={true}
                action={SEARCHBYNAMEPRODUCTS}
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

export default UsersPage