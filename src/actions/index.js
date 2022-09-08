import axios from "axios"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import Cookie from 'js-cookie'
//export const api='http://localhost:3000'
 export const api=process.env.REACT_APP_URL_BACKEND||'https://app3tech-backend.herokuapp.com'
//export const api='https://app3tech-backend.herokuapp.com'

                        /////////////////////////////////////   
                        //      ACCIONES PARA PRODUCTOS    //   
                        /////////////////////////////////////  

//trae todos los productos
export const GETPRODUCTS = createAsyncThunk('GETPRODUCTS', async () => { 
    const response = await axios(`${api}/products`)
    console.log("productos",response)
    return response.data
})
//devuelve las categorias de productos de la tabla category
export const GETCATEGORIES = createAsyncThunk('GETCATEGORIES', async () => { 
    const response = await axios(`${api}/categories`)
    return response.data
})
//crea una categoria
export const CREATECATEGORY = createAsyncThunk('CREATECATEGORY', async (input) => { 
    const token=Cookie.get('token')
    const response=await axios.post(`${api}/categories`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})
//devuelve un producto, pasandole un id
export const GETPRODUCT = createAsyncThunk('GETPRODUCT', async (id) => { 
    const response = await axios(`${api}/products/${id}`,{headers:{
        'productId':`${id}`
      }})
    return response.data
})
//recibe info por post y crea un producto
export const CREATEPRODUCT = createAsyncThunk('CREATEPRODUCT', async (input) => { 
    const token=Cookie.get('token')
    const response=await axios.post(`${api}/products`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Busca un producto por su nombre
export const SEARCHBYNAMEPRODUCTS=createAsyncThunk('SEARCHBYNAMEPRODUCTS',async (name)=>{
    const result=await axios(`${api}/products?name=${name}`) 
    return result.data
})

//Busca todos los productos de una categoria
export const SEARCHBYCATEGORY=createAsyncThunk('SEARCHBYCATEGORY',async (name)=>{ 
    const result=await axios(`${api}/products?filterName=category&filterOrder=${name?.toLocaleLowerCase()}&names=stock&sort=1`) 
    return result.data
})

//Ordena los productos por precio. La lógica se hace en el Reducer
export const ORDERBYPRICE=createAction('ORDERBYPRICE',(order)=>{ 
    return {
        payload:order
    }
})

//Devuelve todos los preoductos que tengan la misma categoria que el producto con la id seleccionada
export const GETRECOMMENDED=createAsyncThunk('GETRECOMMENDED',async (id)=>{
    const allProducts = await axios.get(`${api}/products`)
    const productById = await axios.get(`${api}/products/${id}`)
    //console.log('allProducts',allProducts)
    //console.log('productById',productById)
    const final=allProducts.data.filter(product=>{
        if(product.category._id===productById.data.category&&product._id!==id)return true
        else return false
      })
    return final
})

//Edita el producto
export const MODIFYPRODUCT=createAsyncThunk('MODIFYPRODUCT',async (input)=>{
    const token=Cookie.get('token')
    const product=await axios.put(`${api}/products/${input._id}`,input,{headers:{
      'x-access-token':`${token}`
    }})
    return product.data
  })
// Elimina el producto
export const DELETEPRODUCT=createAsyncThunk('DELETEPRODUCT',async (id)=>{
const token=Cookie.get('token')
const result=await axios.delete(`${api}/products/${id}`,{
    headers:{
        'x-access-token':token
    }
}) 
return result.data
  })


                        ///////////////////////////////////////   
                        //      ACCIONES PARA USUARIOS      //   
                        /////////////////////////////////////    

//Devuelve todos los usuarios
export const GETUSERS = createAsyncThunk('GETUSERS', async () => { 
    const token=Cookie.get('token')
    const response = await axios(`${api}/users`,{headers:{
        'x-access-token':`${token}`
      }})
    return response.data
})

//Veridica si el usuario es admin o user
export const VERIFYADMIN=createAsyncThunk('VERIFYADMIN',async ()=>{
    const user=JSON.parse( Cookie.get('user') )
    if(user){
        if(user.role.includes('admin'))return true
    }
    return false
})

//Busca un usuario por el nombre
export const SEARCHBYNAMEUSERS=createAsyncThunk('SEARCHBYNAMEUSERS',async (name)=>{
    const token=Cookie.get('token')
    const result=await axios.get(`${api}/users?name=${name}`,{
        headers:{
            'x-access-token':token
        }
    }) 
    return result.data
})

//Edita el usuario
export const MODIFYUSER=createAsyncThunk('MODIFYUSER',async (input)=>{
    const token=Cookie.get('token')
    console.log("input",input)
    const user=await axios.put(`${api}/users/${input._id}`,input,{headers:{
      'x-access-token':`${token}`
    }})
    return user.data
})

//Crea una Review de un producto
export const CREATEREVIEW = createAsyncThunk('CREATEREVIEW', async (input) => { 
    const token=Cookie.get('token')
    const response=await axios.post(`${api}/users/review`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Edita la Review de un producto
export const MODIFYREVIEW=createAsyncThunk('MODIFYREVIEW',async (postValue)=>{
 
    const token=Cookie.get('token')
    const response=await axios.put(`${api}/users/review/${postValue.reviewId}`,postValue,{headers:{
      'x-access-token':`${token}`
    }})
    return response.data
})

/*  Devuelve una sola review
export const GETREVIEW = createAsyncThunk('GETREVIEW', async (id) => {
const response = await axios.get(`${api}/users/review/${id}`)
return response.data
})
*/

//Devuelve todas las reviews de la BDD
export const GETREVIEWS = createAsyncThunk('GETREVIEWS', async () => { 
    const token=Cookie.get('token')
    const response = await axios.get(`${api}/users/review`,{headers:{
        'x-access-token':`${token}`
      }})
    return response.data
})

//Devuelve todas las reviews de un producto
export const GETPRODUCTREVIEWS = createAsyncThunk('GETPRODUCTREVIEWS', async (id) => { 
    const response = await axios(`${api}/products/${id}/reviews`)
    return response.data
})

// Muestra la Wishlist
export const GETWISHLIST = createAsyncThunk('GETWISHLIST', async (productId) => { 
    const token=Cookie.get('token')
    const response=await axios(`${api}/users/wishlist/12345` ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
}) 

//Agrega un producto a la Wishlist
export const ADDTOWISHLIST = createAsyncThunk('ADDTOWISHLIST', async (productId) => { 
    const token=Cookie.get('token')
    const response=await axios.post(`${api}/users/wishlist`,productId ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Elimina un producto de la WishList
export const DELETEFROMWISHLIST=createAsyncThunk('DELETEFROMWISHLIST',async (productId)=>{
    const token=Cookie.get('token')
    const wishlist=await axios.put(`${api}/users/wishlist/${productId}`,productId,{headers:{
      'x-access-token':`${token}`
    }})
    return wishlist.data
})

//Devuelve todas las preguntas de un producto
export const GETPRODUCTQUESTIONS = createAsyncThunk('GETPRODUCTQUESTION', async (productId) => { 
    const token=Cookie.get('token')
    const response = await axios(`${api}/products/${productId}/questions`,{headers:{
        'x-access-token':`${token}`
      }})
    return response.data
})

 //Devuelve todas las preguntas de la BDD
export const GETALLQUESTIONS = createAsyncThunk('GETALLQUESTIONS', async () => {
    const token=Cookie.get('token')
    const response = await axios(`${api}/questions`,{headers:{
        'x-access-token':`${token}`
    }})
    return response.data
})

//Crea una pregunta
export const MAKEQUESTION = createAsyncThunk('MAKEQUESTION', async (input) => { //
    const token=Cookie.get('token')
    const response = await axios.post(`${api}/products/${input.productId}/questions`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Crea una respuesta a una cierta pregunta
export const MAKEANSWER = createAsyncThunk('MAKEANSWER', async (input) => { //
    const token=Cookie.get('token')
    const response = await axios.post(`${api}/products/${input.productId}/questions/${input.questionId}`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

                        ///////////////////////////////////////   
                        //   ACCIONES PARA ORDENES Y PAGOS  //   
                        /////////////////////////////////////    

// Devuelve todas las ordenes de la BDD
export const GETORDERS = createAsyncThunk('GETORDERS', async () => { 
    const token=Cookie.get('token')
    const response = await axios(`${api}/orders`,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Editar una orden de la BDD
export const EDITORDER=createAsyncThunk('EDITYORDER',async (input)=>{
    const token=Cookie.get('token')
    const order=await axios.put(`${api}/orders/${input._id}`,input,{headers:{
      'x-access-token':`${token}`
    }})
    return order.data
})

//Buscar producto o usuario en una orden, en las rutas esta la logica, puedo buscar por nombre o email de usuario y por nombre de producto
export const SEARCHORDERS = createAsyncThunk('SEARCHORDERS', async (name) => { //
    const token=Cookie.get('token')
    const response = await axios(`${api}/orders?name=${name}`,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})

//Devuelve una orden deteminada a  traves del id de la orden
export const GETORDER=createAsyncThunk('GETORDER',async (id)=>{
    const token=Cookie.get('token')
    const result=await axios.get(`${api}/orders/${id}`,{
        headers:{
            'x-access-token':token
        }
    }) 
    return result.data
  })

//Crea una orden
export const CREATEORDER=createAsyncThunk('CREATEORDER',async (data)=>{
    const token=Cookie.get('token')
    const result=await axios.post(`${api}/orders`,data,{
        headers:{
            'x-access-token':token
        }
    })
    return result.data._id
})
  
// Pagar una orden
export const PAYORDER=createAsyncThunk('PAYORDER',async (data)=>{
    const token=Cookie.get('token')
    var result=await axios.post(`${api}/orders/pay`,data,{
        headers:{
            'x-access-token':token
        }})
    return result.data
})

//Eliminar una orden
export const DELETEORDER=createAsyncThunk('DELETEORDER',async (id)=>{
    const token=Cookie.get('token')
    const result=await axios.delete(`${api}/orders/${id}`,{
        headers:{
            'x-access-token':token
        }
    }) 
    return result.data
  })







