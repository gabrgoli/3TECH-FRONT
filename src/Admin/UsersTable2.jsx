
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



    const usuarios=useSelector((State) => State.rootReducer.users);

    useEffect(()=>{
        dispatch(GETUSERS())
      },[dispatch])

    const columns = [
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'amountOfBuys', headerName: 'Cantidad de productos comprados totales', width: 350 },
    ];

    const rows = usuarios.map( (user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        products: user?.products?.length,
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