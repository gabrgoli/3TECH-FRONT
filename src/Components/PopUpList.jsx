import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CardMedia, IconButton,Box,Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useSelector,useDispatch} from 'react-redux'
import { DELETEFROMWISHLIST } from '../actions';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import colorStyles from '../styles'
export default function BasicPopover({list}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()


  // const deleteElement=(productId)=>{
  //   setList((old)=>old.filter((e)=>e._id!==productId))
  //   dispatch(DELETEFROMWISHLIST({productId:productId}))
  // }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} variant="contained" onClick={handleClick} style={{color: 'white'}}>
        <Badge  color='success' badgeContent={list?.length} >
           <Typography color='black'>Mostrar Orden</Typography>
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {list&&list[0]? 
        list?.map(product=>(
          <>
          <Box sx={{display:'flex',justifyContent:'space-between'}}>
            <Box sx={{width:100,marginX:1}}>
              <CardMedia
                component="img"
                height="100"
                width='100'
                image={product?.imageProduct[0]}
                alt="gf"
                sx={{objectFit:'contain'}}
                onClick={()=>{navigate(`/product/${product._id}`)}}
              />
            </Box>
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',mt:2}} onClick={()=>{navigate(`/product/${product._id}`)}}>
              <Typography sx={{fontSize:18,maxHeight:70}}>{product.name.slice(0,40)}</Typography>
              <Typography sx={{fontSize:15,maxHeight:70}}>Precio: ${product.price}</Typography>
              <Typography sx={{fontSize:18,maxHeight:70}}>Cantidad de productos:{product.quantity}</Typography>
            </Box>

            {/* <IconButton onClick={()=>deleteElement(product._id)}style={{color: 'red',borderRadius:0}}>
              <FavoriteIcon />
            </IconButton> */}
          </Box>
          <Divider/>
          </>
        )):
          <Box>
            <Typography sx={{m:2,fontWeight:20}}>No hay elementos</Typography>
          </Box>
        }
      </Popover>
    </div>
  );
}
