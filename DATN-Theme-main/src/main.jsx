import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Khởi tạo AOS
AOS.init();

// Tạo phần tử root và render ứng dụng
const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='869197159577-er71cliofc84oipgjpakc739foisad8i.apps.googleusercontent.com'>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
