import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Rating } from '@mui/material';
import Box from '@mui/material/Box';
import { MAKEQUESTION, MAKEANSWER } from '../actions';
import swal from 'sweetalert';
import {   useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';


const useAppDispatch = () => useDispatch();

export default function FormDialog({product,user,textButton,question, isAdmin,setComments}) { //FUNCION PRINCIPAL

  const dispatch=useAppDispatch()

  const [postValue,SetPostValue]=React.useState({
    productId:'',
    productName:'',
    comment:'',
    questionId:'',
    answerId:'',
    userEsmail:'',
  })

React.useEffect(()=>SetPostValue(()=>({
   //FORMATO DE ENVIO DE DATOS A LA BDD
  productId: product._id,
  productName:product.name,
  comment: '', //setea en "" a comment como default
  questionId:question?._id,
  answerId:'',
  userEmail: question?.userEmail,
})),[product,user])

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendQuestion = async() => { //FUNCION QUE ENVIA LOS DATOS A LA BDD
    
    if(postValue.comment===""){return swal({title:"Error",text:"Tiene que haber una pregunta",icon:"error",button:"Aceptar"})}
    dispatch(MAKEQUESTION(postValue)).then((r)=>{
      if(r.payload==="Se envio la pregunta"){
          setComments((old)=>[...old,{...postValue,replies:[]}])//se le agrega replies con un array vacio para que no rompa en ProductDetails linea 257
          setOpen(false);
          swal({title:"Realizado",text:"Se realizo la pregunta", icon:"success",button:"Aceptar"})
        }else{
          setOpen(false);
          //func()
          swal({title:"Error",text:"No se envio la pregunta",icon:"error",button:"Aceptar"})
        }    
      })      
  };

  const sendAnswer = async() => { //FUNCION QUE ENVIA LOS DATOS A LA BDD
    if(postValue.comment===""){return swal({title:"Error",text:"Tiene que haber una respuesta",icon:"error",button:"Aceptar"})}
    dispatch(MAKEANSWER(postValue)).then((r)=>{
      if(r.payload==="Se envio la respuesta"){
          setComments((old)=>old.map((comment)=>{
            if(comment._id===question._id)return {...comment,replies:[{comment:postValue.comment}]}
            else return comment
          }))
          setOpen(false);
          swal({title:"Realizado",text:"Se respondio la pregunta", icon:"success",button:"Aceptar"})
        }else{
          setOpen(false);
          //func()
          swal({title:"Error",text:"No se envio la respuesta",icon:"error",button:"Aceptar"})
        }    
      })      
  };

  return (
    <div>

      <Button fullWidth variant="outlined" onClick={handleClickOpen}>
       {isAdmin? 'Responder pregunta' : 'Hacer pregunta' }
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isAdmin?'Responder':'Realiza una pregunta'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isAdmin?`Responder esta pregunta sobre ${product.name}`:`Que duda tenes sobre ${product.name}?`}
          </DialogContentText>

          <TextField
            
            margin="dense"
            id="name"
            label={isAdmin?"Deja tu respuesta!":"Deja tu consulta!"}
            fullWidth
            variant="standard"
            height={300}
            onChange={(e)=>SetPostValue((old)=>({...old,comment:e.target.value}))}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={isAdmin? sendAnswer:sendQuestion}>Enviar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}