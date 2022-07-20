import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Rating } from '@mui/material';
import Stars from './stars'
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { CREATEREVIEW,MODIFYREVIEW } from '../actions';
import swal from 'sweetalert';
import {   useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';

const labels = {
  0.5: 'Malo',
  1: 'Malo+',
  1.5: 'Pobre',
  2: 'Pobre+',
  2.5: 'Aceptable',
  3: 'Aceptable+',
  3.5: 'Bueno',
  4: 'Bueno+',
  4.5: 'Excelente',
  5: 'Excelente+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const useAppDispatch = () => useDispatch();

export default function FormDialog({product,order,func,reviews}) { //FUNCION PRINCIPAL

  const dispatch=useAppDispatch()
  const navegar = useNavigate()
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [postValue,SetPostValue]=React.useState({
    review: 0,
    productId:'',
    comment:'',
    order: '',
    showProduct:'',
    showUser:'',
    reviewId:''
  })


 const idReviewObtain = (product,order, reviews)=>{
    let id='valorinicialnopuedeservacio'
    reviews?.map((review)=>(
      ((review.order?._id===order._id)&&(review.product?._id===product._id))&&(id=review._id)
    ))
    return id
 }


React.useEffect(()=>SetPostValue(()=>({
   //FORMATO DE ENVIO DE DATOS A LA BDD
  reviewId:idReviewObtain(product, order,  reviews),
  review: value,
  productId: product._id,
  comment: '',
  orderId:order._id,
  showProduct: product.name,
  showUser: order.user.email
})),[product,order,value])

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendReview = async() => { //FUNCION QUE ENVIA LOS DATOS A LA BDD

    dispatch(CREATEREVIEW(postValue)).then((r)=>{
      if(r.payload==="se guardo la calificacion"){
          setOpen(false);
          func()
          swal({
          title:"Realizado",
          text:"Se guardo la calificacion",
          icon:"success",
          button:"Aceptar"})
        }else{
          setOpen(false);
          func()
          swal({
            title:"Error",
            text:"No se guardo la calificacion",
            icon:"error",
            button:"Aceptar"})
          
        }
       
      })  
      
  };



  const sendModifyReview = () => { //FUNCION QUE ENVIA LOS DATOS A LA BDD


    dispatch(MODIFYREVIEW(postValue)).then((r)=>{

      if(r.payload==="se actualizo la calificacion"){
          setOpen(false);
          func()
          swal({
          title:"Realizado",
          text:"Se actualizó la calificacion",
          icon:"success",
          button:"Aceptar"})
        }else{
          setOpen(false);
          func()
          swal({
            title:"Error",
            text:"No se guardo la calificacion",
            icon:"error",
            button:"Aceptar"})
          
        }
       
      })  
      
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} /*disabled={product.hasReview?true:false}*/>
        <Rating precision={0.5} name="read-only" value={product.hasReview} readOnly max={5}/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deja tu Calificación de este producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Que te parecio ${product.name}?`}
          </DialogContentText>
{/* ------------------------------------------  COMPONENTE ESTRELLA INICIO---------------------------------------- */}
  <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
          SetPostValue((old)=>({...old,review:newValue}))
          SetPostValue((old)=>({...old,product:product._id}))
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
          
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
  </Box>

{/* ------------------------------------------  COMPONENTE ESTRELLA FIN---------------------------------------- */}

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Deja un comentario!"
            fullWidth
            variant="standard"
            height={300}
            onChange={(e)=>SetPostValue((old)=>({...old,comment:e.target.value}))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={product?.hasReview===0?sendReview:sendModifyReview}>Enviar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}