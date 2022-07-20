import { FC } from 'react';

import { Grid, Card, CardContent, Typography,Button } from '@mui/material';
import { NavLink,Link } from 'react-router-dom';
import { useState, useEffect,useMemo } from "react";




export default function SummaryTile ({ title, subTitle, icon,link})  {

    const [isHovered, setIsHovered] = useState (false);

  return (
    
    <Grid  item xs={12} sm={4} md={3}>
          
            <Link  to={`/${link}`} className={link!==undefined?'button-active':'disabled-link'}> 
                <Card  className='button-active' sx={{ display: 'flex', height:'200', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'}}>
                    <CardContent sx={{ width: 50, display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                        { icon }
                    </CardContent>
                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h3'>{ title }</Typography>
                        <Typography variant='caption'>{ subTitle }</Typography>
                    </CardContent> 
                    
                </Card>
            </Link>   
              
    </Grid>

   
  )
}
