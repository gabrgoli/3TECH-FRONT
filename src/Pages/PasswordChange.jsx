import React from "react";
import NavBar from "../Components/NavBar"
import { useState } from 'react';
import {   useNavigate } from "react-router-dom"
import { /*TextField,Select,Container, CardMedia,Link, FormLabel, FormControlLabel, UploadOulined, MenuItem*/ Box, InputLabel, OutlinedInput, InputAdornment, Typography, Button } from '@mui/material';
//import { useDispatch } from 'react-redux'


import IconButton from '@mui/material/IconButton';
//import Input from '@mui/material/Input';
//import FilledInput from '@mui/material/FilledInput';
//import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import swal from 'sweetalert';
import Swal from 'sweetalert2/src/sweetalert2.js'

function validate(newPass){
  let errors = {} //creo un objeto vacio
  
  if (!newPass.password){ 
      errors.password = "Tu contraseña no puede ser vacía"
  } else if (newPass.password.length<6){
      errors.password = "tu contraseña debe tener por lo menos 6 caracteres"
  } 
  else if (!(/\d/.test(newPass.password))){//verifica si tiene numero
    errors.password = "tu contraseña debe tener por lo menos 1 número"
}

  return errors
}

export default function PasswordChange() {

  //const dispatch=useDispatch()
  const navegar = useNavigate()  //para navegar al home luego de postear el formulario
  const [newPass, setnewPass] = React.useState({
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({}) //estado local para manejar errores, objeto vacio

  const handleChange = (prop) => (event) => {
    setnewPass({ ...newPass, [prop]: event.target.value });

    setErrors(validate({ //setea mi funcion errores pasando la funcion validate con variable post
      ...newPass,
      [prop]: event.target.value
  }))
  };

  const handleClickShowPassword = () => {
    setnewPass({
      ...newPass,
      showPassword: !newPass.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  
    function handleSubmit(e){
      e.preventDefault()
          //const newPost={...input,imageProduct:images[0]?images:["https://res.cloudinary.com/dnlooxokf/image/upload/v1654057815/images/pzhs1ykafhvxlhabq2gt.jpg"]} // se prepara un objeto con los campos del fomrulario y sus imagenes
          //dispatch(CREATEPRODUCT(newPost))
          swal({
            title:"Se cambio la contraseña exitosamente",
            text:"Se reaizo el cambio correctamente",
            icon:"success",
            button:"Aceptars"
          })

          Swal.fire({
            title: 'Custom width, padding, color, background.',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            backdrop: `
              rgba(0,0,123,0.4)
              url("/images/nyan-cat.gif")
              left top
              no-repeat
            `
          })


          //navegar("/")//se accede al home
         // window.location.reload();//se refresca para activar el dispatch de GETPRODUCTS()       
  }


  return (
      <div>
        <NavBar/>

        <Typography display='flex'  justifyContent='center' variant='h2' mt={18}>Cambio de contraseña</Typography>

        <Box display='flex'  mt={5}  justifyContent='center' >
              <FormControl sx={{  width: '50%' }} variant="outlined"  mt={5}>
                <InputLabel htmlFor="outlined-adornment-password" >Nueva contraseña</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={newPass.showPassword ? 'text' : 'password'}
                  value={newPass.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {newPass.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />                                         
                    <Button fullWidth sx={{ mb: 3 }} disabled={newPass.password===""|| errors.password}  width="100%" type="submit" onClick={(e) => handleSubmit(e)}>Cambiar contraseña</Button>
              </FormControl>
        </Box>
        <Typography display='flex' justifyContent='center'>{errors.password && (<p >{errors.password}</p>)}</Typography>
      </div>
    );
  }
