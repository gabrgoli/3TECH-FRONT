import * as React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography,Avatar,Divider, IconButton,TextField,Input } from '@mui/material'
import NavBar from '../Components/NavBar'
import LocalMallIcon from '@mui/icons-material/LocalMall';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
//import {MODIFYUSER} from '../../actions'
import { NavLink } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import color from '../styles'
import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../Components/Loading'
import { MODIFYUSER } from '../actions';
import swal from 'sweetalert'
import Cookie from 'js-cookie'


const Profile=()=>{
    const dispatch=useDispatch()
    const [field,setField]=useState({})
    const user=Cookie.get('user') && JSON.parse(Cookie.get('user'))

    React.useEffect(()=>{
        setField(()=>({
             _id:user?._id||'',
             avatar:user?.avatar||'',
             name:user?.name||'',
             email: user?.email||'',
             adress:user?.adress||'',
             city:user?.city||'',
             country:user?.country||'',
             phone:user?.phone||''
         }))
    },[])

    const [editable,setEditable]=useState({
        avatar:false,
        name:false,
        email: false,
        password: false,
        adress:false,
        city:false,
        country:false,
        phone:false
    })
    const handleChange=(campo)=>{
        setEditable((old)=>({...old,[campo]:true}))
    }
    const handleSave=(campo)=>{
        setEditable((old)=>({...old,[campo]:false}))
    }
    const Edit=(e)=>{
        setField((old)=>({...old,[e.target.name]:e.target.value}))
    }
    const UploadChanges=()=>{
        dispatch(MODIFYUSER(field)).then(r=>{
            if(r.payload._id)swal("Perfecto!", "Cambios guardados", "success");
        }).catch(e=>{
            swal("Oh oh!", "Algo salió mal", "error");
        })
    }
    return(
        user?<Box>
            <NavBar/>
            <Box sx={{mt:15,mb:3,marginX:{xs:3,md:'25%'},p:3,borderRadius:3,boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
            display:'flex',flexDirection:'column',justifyContent:'space-around'}}>

            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            {/* <Box sx={{display:'flex',width:'100%',justifyContent:'flex-end',mb:2}}>
                <IconButton sx={{display:'flex',borderRadius:1,bgcolor:color.color2}}>
                    <LocalMallIcon/>
                    <Typography variant='body2' sx={{fontWeight:20,mt:0,ml:1,color:'black'}}>Mis Compras</Typography>
                </IconButton>
            </Box> */}
            <Avatar sx={{height:200,width:200}} alt={user.name} src={user.avatar||user.picture}/>
            <Typography variant='h5' sx={{fontWeight:20,m:2}}>{user.given_name||user.name}</Typography>

            <Divider flexItem/>

            
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%'}}>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Nombre: {editable.name?
                    <TextField name='name' variant='standard' size='small' placeholder={field.name} onChange={(e)=>Edit(e)}/>
                    :field.name}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.name?handleSave('name'):handleChange('name')}}>
                        {editable.name?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Correo: {editable.email?
                    <TextField name='email' variant='standard' size='small' placeholder={field.email} onChange={(e)=>Edit(e)}/>
                    :field.email}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.email?handleSave('email'):handleChange('email')}}>
                        {editable.email?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>
                
                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Dirección: {editable.adress?
                    <TextField name='adress' variant='standard' size='small' placeholder={field.adress} onChange={(e)=>Edit(e)}/>
                    :field.adress}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.adress?handleSave('adress'):handleChange('adress')}}>
                        {editable.adress?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Ciudad: {editable.city?
                    <TextField name='city' variant='standard' size='small' placeholder={field.city} onChange={(e)=>Edit(e)}/>
                    :field.city}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.city?handleSave('city'):handleChange('city')}}>
                        {editable.city?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>País: {editable.country?
                    <TextField name='country' variant='standard' size='small' placeholder={field.country} onChange={(e)=>Edit(e)}/>
                    :field.country}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.country?handleSave('country'):handleChange('country')}}>
                        {editable.country?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Telefono: {editable.phone?
                    <TextField name='phone' variant='standard' size='small' placeholder={field.phone} onChange={(e)=>Edit(e)}/>
                    :field.phone}
                    </Typography>
                    <IconButton sx={{bgcolor:color.color2}} onClick={(e)=>{editable.phone?handleSave('phone'):handleChange('phone')}}>
                        {editable.phone?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',width:'100%',justifyContent:'center',mt:5}}>
                <IconButton sx={{display:'flex',borderRadius:1,bgcolor:color.color2}} onClick={()=>UploadChanges()}>
                    <Typography variant='body2' sx={{fontWeight:20,mt:0,mr:1,color:'black'}}>Guardar</Typography>
                    <SaveIcon/>
                </IconButton>
                </Box>
            </Box>
            </Box>

            <Box>

            </Box>

            </Box>
        </Box>:<Loading/>
    )
}

export default Profile