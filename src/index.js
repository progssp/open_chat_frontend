import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login/Login';
import Test from './components/Test';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const router = createBrowserRouter([
  {
    path: '/frontend',
    element: <Login/>
  },
  {
    path: '/frontend/chat',
    element: <App/>
  },
  {
    path: '/frontend/test',
    element: <Test/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
// serviceWorkerRegistration.register();