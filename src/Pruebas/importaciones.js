import { ADDTOWISHLIST,DELETEFROMWISHLIST,GETORDER, PAYORDER,GETPRODUCT,GETPRODUCTS,GETRECOMMENDED,GETUSERS,GETCATEGORIES,MODIFYPRODUCT,MODIFYUSER,DELETEORDER,DELETEPRODUCT,CREATEORDER,CREATEPRODUCT,SEARCHBYCATEGORY,SEARCHBYNAMEUSERS,SEARCHBYNAMEPRODUCTS,VERIFYADMIN,ORDERBYPRICE } from '../actions';

import {Rating,CardMedia,Box, Select,Button, Card, CardContent,Switch,FormControl, Divider, Grid,Typography,Container,Chip,ImageList,ImageListItem,Avatar,ListItemAvatar,ListItemText,ListItem} from '@mui/material';

import { NavLink,Link, useLocation, Navigate, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect,useMemo } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay,Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import Cookie from 'js-cookie'

import { useAuth0 } from "@auth0/auth0-react";

import {AddCircleOutline, RemoveCircleOutline,RemoveShoppingCartOutlined, GroupOutlined, PeopleOutline,AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined, AddShoppingCart, Visibility,VisibilityOff,IconButton,LocalMallIcon,EditIcon,CheckIcon,SaveIcon} from '@mui/icons-material'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Swal from 'sweetalert2/src/sweetalert2.js'
import swal from 'sweetalert';

 