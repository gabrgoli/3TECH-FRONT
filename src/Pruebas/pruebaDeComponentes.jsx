import React from "react";
import NavBar from "../Components/NavBar"
import ItemCounter from "../Components/ItemCounter"
import { useState } from 'react';
import LineChart from './LineChart'

export default function Prueba() {

    const [tempCartProduct, setTempCartProduct] = useState({
        quantity: 1
      })

    const onUpdateQuantity = ( quantity ) => {
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity
          }));
      }




  return (
    <div>
        {/* <NavBar/> */}
        <LineChart/>
        {/* <ItemCounter currentValue={tempCartProduct.quantity} updatedQuantity={onUpdateQuantity} maxValue={500}/> */}
    </div>
    )
  }