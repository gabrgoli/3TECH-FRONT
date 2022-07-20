import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Divider,Box, TextField,Rating,FormControlLabel,Switch,FormControl,Select, Container,InputLabel, Typography } from '@mui/material';
import {ORDERBYPRICE} from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import { maxHeight } from '@mui/system';

export default function FilterByCategory() {

    const dispatch=useDispatch()
    const [selectValue,setSelectValue]=React.useState('inicial')
    async function handleFilterCategory(e) {
      dispatch(ORDERBYPRICE(e.target.value))
    }


  return (
    <Box sx={{display:'flex',flexDirection:"row",justifyContent:'flex-end',m:2}} >
      
      <Typography>Ordenar por:</Typography>
      <FormControl>
      {/* <InputLabel id="demo-simple-select">Seleccionar</InputLabel> */}
      <Select
        id="demo-simple-select"
        value={selectValue}
        onChange={(e) => {
          handleFilterCategory(e)
          setSelectValue(()=>e.target.value)
        }}
        name='category'
        sx={{ height:24,ml:2 }}
      >
          <MenuItem disabled value="inicial">
            <em>Seleccionar</em>
          </MenuItem>
          <MenuItem key='2' value='precioMax'>Maximo</MenuItem>
          <MenuItem key='1' value='precioMin'>Mininmo</MenuItem>
              
        </Select>
        </FormControl>
    </Box>
  );
}