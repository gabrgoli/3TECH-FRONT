import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import store from './store/index'
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
      <Auth0Provider
      domain="dev-ejyfjrhp.us.auth0.com"
      clientId="T1h3rtaZUnoBne5gXqSHTsMd18L6dm4R"
      //domain="dev-ejyfjrhp.us.auth0.com"
      //clientId="DYn8pl0kdgerSlu0MMlGrceDgW0OcUD6"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
