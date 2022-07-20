
import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material'

export default function  ItemCounter ({currentValue, updatedQuantity, maxValue}){

    const addOrRemove = ( value ) => {
        if ( value === -1 ) {
          if ( currentValue <= 0 ) return;
          if ( currentValue <= 1 ) return;
          
    
          return updatedQuantity( currentValue - 1);
        }
    
        if ( currentValue >= maxValue ) return;
    
        return updatedQuantity( currentValue + 1 );
      }

    return(
        <Box display='flex' alignItems='center'>
             <IconButton onClick={ () => addOrRemove(-1) }>
                <RemoveCircleOutline/>
            </IconButton>
            <Typography sx={{ width: 40, textAlign:'center' }}> {currentValue} </Typography>
            <IconButton onClick={ () => addOrRemove(+1) }>
                <AddCircleOutline/>
            </IconButton>
        </Box>
    )
}



/* 
esto va donde se quiera implementar

    const [productsInCart, setProductsInCart] = useState({
        quantity: 1
      })

    const onUpdateQuantity = ( quantity ) => {
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity
          }));
      }

    <ItemCounter 
      currentValue={productsInCart.quantity} 
      updatedQuantity={onUpdateQuantity} 
      maxValue={500}
    />


        */