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

export default function BasicPopover({wishlist,setWishList}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()


  const deleteElement=(productId)=>{
    setWishList((old)=>old.filter((e)=>e._id!==productId))
    dispatch(DELETEFROMWISHLIST({productId:productId}))
  }
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
        <Badge badgeContent={wishlist?.length} color="error">
           <FavoriteIcon/>
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
        {wishlist&&wishlist[0]? wishlist?.map(product=>(
          <>
          <Box key={product._id} sx={{display:'flex',justifyContent:'space-between'}}>
            <Box key={product._id+1} sx={{width:100,marginX:1}}>
              <CardMedia
                key={product._id+2}
                component="img"
                height="100"
                width='100'
                image={product?.imageProduct[0]}
                alt="gf"
                sx={{objectFit:'contain'}}
                onClick={()=>{navigate(`/product/${product._id}`)}}
              />
            </Box>
            <Box key={product._id+3} sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',mt:2}} onClick={()=>{navigate(`/product/${product._id}`)}}>
              <Typography sx={{fontSize:10,maxHeight:50}}>{product.name.slice(0,40)}</Typography>
              <Typography sx={{fontSize:10,maxHeight:50}}>${product.price}</Typography>
            </Box>

            <IconButton key={product._id+4} onClick={()=>deleteElement(product._id)}style={{color: 'red',borderRadius:0}}>
              <FavoriteIcon />
            </IconButton>
          </Box>
          <Divider key={product._id+6}/>
          </>
        )):<Box>
          <Typography sx={{m:2,fontWeight:20}}>No tienes productos en favoritos</Typography>
          </Box>}
      </Popover>
    </div>
  );
}
