import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';





export default function SearchInput({placeholder,url,dinamic,action}) {
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = React.useState('')

  const handleChange = (e) => {
    setInput(() => e.target.value)
  }

   React.useEffect(()=>
   {dinamic && dispatch(action(input))}
   ,[input])


  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: {xs:'100%', md:'35vw'}, bgcolor: '#7a7a7a'}}
      onSubmit={(e) => {
        e.preventDefault()
        dispatch(action(input))
        navigate(`${url}`)
        //setInput(()=>'')
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, color: 'white',fontSize:{xs:12,md:18} }}
        placeholder={placeholder}
        value={input}
        onChange={(e) =>handleChange(e)}
      />
      <IconButton type="submit" sx={{ }} >
        <SearchIcon sx={{ color: 'white' }} />
      </IconButton>
    </Paper>
  );
}
