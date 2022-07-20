import { useState, useEffect } from 'react';
import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined, AddShoppingCart } from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NavBar from '../Components/NavBar'
import { Grid, Typography,Box,Button,Container } from '@mui/material'
import  CardDashboard  from './CardDashboard'
import { useDispatch, useSelector } from 'react-redux';
import {GETUSERS} from '../actions'
import { GETPRODUCTS } from '../actions'
import { GETORDERS } from '../actions'
import { GETALLQUESTIONS } from '../actions'
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading'

const useAppDispatch = () => useDispatch();

const DashboardPage = () => {
    const navigate=useNavigate()
    const products=useSelector((State) => State.rootReducer.products);
    const users=useSelector((State) => State.rootReducer.users);
    const orders=useSelector((State) => State.rootReducer.orders);
    let ordenesPagas = orders?.filter((order)=>order.isPaid===true)
    
    const [questions,setQuestions]=useState([])
    const dispatch=useAppDispatch()

    const [refreshIn, setRefreshIn] = useState(25);

    useEffect(()=>{
      dispatch(GETUSERS())
      dispatch(GETORDERS())
      dispatch(GETPRODUCTS())
      dispatch(GETALLQUESTIONS()).then((r)=>setQuestions(()=>r.payload))
    },[dispatch,refreshIn===0])


    useEffect(() => {
      const interval = setInterval(()=>{ //set interval es una funcion de js
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 25 );
      }, 1000 );
    
      return () => clearInterval(interval)
    }, []);

    let lowInventory = products?.filter((p)=> p.stock<10)
    let productsWithNoInventory = products?.filter((p)=> p.stock===0)
    let cantidadDePreguntasSinRespuesta = questions?.filter((question)=>question.replies.length===0)



  return (
    

    <Container>

      <NavBar/>

      {/* {products[0]&&orders[0]&&users[0]&&questions[0]? */}
      {products[0]&&users[0]?
      <>
          <Box display="flex" flexDirection='row' justifyContent='space-between'    mt={15}>
                <Box>
                    <Typography    variant='h3' component='h1'>
                        { <DashboardOutlined /> }{' '} { 'Dashboard' }
                    </Typography>
                    <Typography  variant='h2' sx={{ mb: 1 }}>{ 'Estadisticas generales' }</Typography>
                </Box>
                <Box>
                    <CardDashboard 
                        title={ refreshIn }
                        subTitle="Actualización en:"
                        icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} /> }
                    />
                </Box>
          </Box>
        
        <Grid container spacing={2}>

            <CardDashboard 
                link='orderstable'
                title={ orders?.length }
                subTitle="Ordenes totales"
                icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
            />

            <CardDashboard 
                title={ ordenesPagas?.length }
                subTitle="Ordenes pagadas"
                icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} /> }
            />
            
            <CardDashboard 
               
                title={ orders?.length-ordenesPagas?.length }
                subTitle="Ordenes sin pagar"
                icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} /> }
            />

        
            <CardDashboard 
                link='admin/userstable'
                title={ users?.length }
                subTitle="Usuarios"
                icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} /> }
            />

            <CardDashboard
                link='admin/productstable'
                title={products?.length }
                subTitle="Productos"
                icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} /> }
            />

            <CardDashboard 
                title={ productsWithNoInventory?.length }
                subTitle="Sin inventario"
                icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} /> }
            />

          

            <CardDashboard 
                title={ lowInventory?.length }
                subTitle="Bajo Inventario (<10)"
                icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} /> }
            />


            <CardDashboard 
                link='admin/questionstable'
                title={ cantidadDePreguntasSinRespuesta?.length }
                subTitle="Preguntas sin responder"
                icon={ <HelpOutlineOutlinedIcon color="error" sx={{ fontSize: 40 }} /> }
            />



        </Grid>
        </>
        :
    <Loading/>}
    </Container> 

  )
}

export default DashboardPage