import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CardMedia,Button, IconButton,Box,Divider, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useSelector,useDispatch} from 'react-redux'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';

export default function BasicPopover({dato,row,goToElement,deleteElement,editElement}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()

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
          <Tooltip title={row.name} placement="top"><Typography color='black'>{dato}</Typography></Tooltip> 
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
          <>
          <Box sx={{display:'flex',justifyContent:'space-between'}}>

            <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center' ,width:'100%',mt:2}} >
                <Button onClick={()=>goToElement()}> Ver </Button>
                <Button onClick={()=>editElement()}> {row.isPaid?'':'editar'} </Button>
                <Button  color='error' onClick={(e)=> deleteElement() }>{row.isPaid?'':'Eliminar'}</Button>
            </Box>

          </Box>
          </>
      </Popover>
    </div>
  );
}