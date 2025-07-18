import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { ToastContainer } from 'react-toastify';


import AppRoutes from './Routes.jsx'
import AuthContext from './components/AuthContext.jsx';

import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';



const DOMAIN_URL= import.meta.env.VITE_AUTH0_DOMAIN;
const CLIENT_URL= import.meta.env.VITE_AUTH0_CLIENT;
const AUDIENCE_URL= import.meta.env.VITE_AUTH0_AUDIENCE;
const CALLBACK_URL= import.meta.env.VITE_AUTH0_CALLBACK;

createRoot(document.getElementById('root')).render(
  <Auth0Provider   
    domain= {DOMAIN_URL}
    clientId= {CLIENT_URL}
    authorizationParams={{
      redirect_uri: window.location.origin + CALLBACK_URL,
      audience: AUDIENCE_URL,
    }}
  >

  <AuthContext>
    <BrowserRouter>
      <StrictMode>
      <AppRoutes />
      <ToastContainer />
      </StrictMode>
    </BrowserRouter>
  </AuthContext>
  </Auth0Provider>
);
