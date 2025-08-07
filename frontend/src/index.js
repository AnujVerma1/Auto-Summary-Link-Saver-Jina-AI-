// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const root = document.getElementById('root');
// const clientId = '980647912596-troati5ttmtnits6r634gu1511dpp6gj.apps.googleusercontent.com'; // Replace with actual client ID

// ReactDOM.render(
//   <GoogleOAuthProvider clientId={clientId}>
//     <App />
//   </GoogleOAuthProvider>,
//   root
// );



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';

const clientId = "980647912596-troati5ttmtnits6r634gu1511dpp6gj.apps.googleusercontent.com"; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <GoogleOAuthProvider clientId={clientId}>
    <App />
  // </GoogleOAuthProvider>
);

