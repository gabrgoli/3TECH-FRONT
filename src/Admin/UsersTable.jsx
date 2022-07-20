
import { useState, useEffect } from 'react';
import { DashboardOutlined, GroupOutlined, PeopleOutline } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem, Box, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {GETUSERS, GETORDERS,SEARCHBYNAMEUSERS,MODIFYUSER,SEARCHORDERS} from '../actions'
import { AppDispatch,RootState } from '../store'
import NavBar from '../Components/NavBar'
import SearchBar from '../Components/SearchBar'



const useAppDispatch = () => useDispatch();

const UsersPage = () => {
    const dispatch=useAppDispatch()

    useEffect(()=>{
        dispatch(GETUSERS())
        dispatch(GETORDERS())
      },[dispatch])



    const usuarios=useSelector((State) => State.rootReducer.users);
    const orders=useSelector((State) => State.rootReducer.orders);


console.log("usuarios")

//////////////////////////////////////// MODIFICAR EL ESTADO DEL USUARIO INICIO //////////////////////////////////////

const userStatemap=usuarios.map(user=>( //cargar el  estado con datos de la BDD
    {id:user._id,
    cuentaSuspendida:user.suspendedAccount}
))
    const [userState,setUserState]=useState([]) //estado de usuarios para mostrar
    

    useEffect(()=>{
        setUserState(()=>userStatemap)
    },[usuarios])

    const handleChangeState=(e,row)=>{
        setUserState((state)=>state.map(e=>{
            if(e.id===row.id){
                return {
                    id:e.id,
                    cuentaSuspendida:!e.cuentaSuspendida}
            }
            else return e
        }))
        dispatch(MODIFYUSER({_id:row.id,suspendedAccount: e.target.value==='online'?false:true}))
 }
//|||||______________________________  MODIFICAR EL ESTADO DEL USUARIO  FIN ____________________////


//////////////////////////////  MODIFICAR EL ROL DEL USUARIO /////////////////////////
const [userRol,setUserRol]=useState([]) //estado de usuarios para mostrar

const userRolStatemap=usuarios.map(user=>( // cargar estado userRolStatemap con  datos de la BDD
    {id:user._id,
    rolUser:user.role}
))

 console.log("userRolStatemap",userRolStatemap) 
//                  ejemplo:
// 0: {id: '6294228a1ceba51474078b13', rolUser: 'admin'}
// 1: {id: '629521f73a2bff0012f073fb', rolUser: 'user'}
// 2: {id: '62952463148bb70013a80741', rolUser: 'user'}
// 3: {id: '629536d0ca35de00110052c4', rolUser: 'user'}

useEffect(()=>{ //cargo el estado userRol con todos los valores de userRolStateMap
    setUserRol(()=>userRolStatemap)
},[usuarios])


const handleChangeRol=(e,row)=>{ //e es el nuevo valor 
    setUserRol((rol)=>rol.map(e=>{ //cuando hay un cambio cambia el estado
        if(e.id===row.id){ //
            return {
                id: e.id,
                rolUser: e.rolUser==='admin'?'user':'admin'} //a la prop rolUser le paso su valor negado
        }
        else return e
    }))

    dispatch(MODIFYUSER({_id:row.id, role:e.target.value}))
}

//|||||______________________________  MODIFICAR EL ROL DEL USUARIO FIN____________________////


    const calcularCantidadProductosCompradosTotales = (ordenes,usuario)=> {
        let contador = 0
        ordenes?.map((orden)=>(
            (orden.user?.email===usuario?.email && orden.isPaid)&&
            orden.products.map((product)=>(
                contador=contador+product.quantity
            ))
        ))
        return contador 
      }

    const columns = [
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'amountOfBuys', headerName: 'Cantidad de productos comprados totales', width: 350 },
        {
            field: 'Role',
            headerName: 'Role', 
            width: 200,
            renderCell: ({row}) => {
                return (
                            row.rol==='superadmin'?
                            <Typography color="error" value='superadmin'> superadmin </Typography> 
                            :
                            <Select
                                value={ userRol.filter(e=> e.id===row.id)[0]?.rolUser} //value es el valor del estado userRol, toma el valor de rolUser
                                label="Rol"
                                onChange={(e)=>handleChangeRol(e,row) }
                                sx={{ width: '300px' }}
                            >
                                <MenuItem value='admin'> admin </MenuItem>
                                <MenuItem value='user'> user </MenuItem>

                            </Select>
                            
                        )
            }
        },
        
        { 
            headerName: 'Estado', 
            field: 'Estado',
            width: 200,
            renderCell: ({row}) => {
                return (
                            row.rol==='superadmin'?
                            <Typography color="error" value='superadmin'> superadmin </Typography> 
                            :
                            <Select
                                //ESTE FILTER DE UN IGUAL , DEVUELVE UN ARRAY DE UN ELEMENTO, PORQUE SOLO 1 ES IGUAL
                                value={ userState.filter(e=> e.id===row.id)[0]?.cuentaSuspendida?'bloqueado':'online' }
                                label="state"
                                onChange={(e)=>handleChangeState(e,row) }
                                sx={{ width: '300px' }}
                            > 
                                <MenuItem value='online'> online </MenuItem>
                                <MenuItem value='bloqueado'> bloqueado </MenuItem>
                            </Select>
                        )
            }
        },
    ];

    const rows = usuarios.map( (user) => ({
        id: user._id,
        name: user.name||"sin nombre",
        email: user.email,
        products: user?.products?.length,
        rol: user?.role,
        estado: user?.suspendedAccount,
        amountOfBuys: calcularCantidadProductosCompradosTotales(orders,user)
    }))




  return (
<>
    <NavBar/>



    <Box mt={15} >
        <SearchBar 
                placeholder="buscar por usuario"
                url='/admin/userstable'
                dinamic={true}
                action={SEARCHBYNAMEUSERS}
        />
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: 40000 }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 15 }
                    rowsPerPageOptions={ [20] }
                />

            </Grid>
        </Grid>


    </Box>
</>
  )
}

export default UsersPage