import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Divider,Box, TextField,Rating,FormControlLabel,Switch,FormControl,Select, Container } from '@mui/material';
import {GETCATEGORIES,SEARCHBYCATEGORY,GETPRODUCTS} from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import { maxHeight } from '@mui/system';
import color from '../styles'
import {useLocation, useNavigate } from 'react-router-dom';

export default function FilterByCategory({title}) {
    const [sValue,setSvalue]=React.useState('Todos')
    const location=useLocation()
    const navigate=useNavigate()

    const dispatch=useDispatch()

    React.useEffect(()=>{
        dispatch(GETCATEGORIES())
    },[])
    const categories=useSelector((state)=>state.rootReducer.categories)

    async function handleFilterCategory(e) {      
      if(e.target.value==="Todos") {
        dispatch(GETPRODUCTS())
        if(location!=='/')navigate('/')
      }
      else{
        dispatch(SEARCHBYCATEGORY(e.target.value))
        if(location!=='/')navigate('/')
      }

      return e.target.value
    }

  return (
    <Box sx={{minWidth:100}}>
        <FormControl fullWidth>
          <Select
            id="demo-simple-select"
            value={sValue}
            onChange={(e) => {
              setSvalue(()=>e.target.value)
              handleFilterCategory(e)
            }}
            name='category'
            sx={{ height:24,bgcolor:color.color3,fontSize:{xs:11} }}
          >
              <MenuItem key='select' value='Todos' 
                onClick={()=>{
                  dispatch(GETPRODUCTS()) 
                  if(location!=='/')navigate('/')
                }}>
                  {title}
              </MenuItem>
                  {categories.map((category) => (
                    <MenuItem 
                      key={category._id} 
                      name={category.name} 
                      value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
          </Select>
        </FormControl>
    </Box>
  );
}