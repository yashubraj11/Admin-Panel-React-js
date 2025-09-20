import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLogin from './Adminlog';
import Adminpannel from './Adminpannel';
import File from './File';
let router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />   // default route
  },
  {
    path: '/adminlog',
    element: <AdminLogin />
  },
  {
    path: '/dashboard',
    element: <Adminpannel />
  },
  {
    path:'/file',
    element: <File/>
  }
]);

const Controller = () => {
  return <RouterProvider router={router} />;
};

export default Controller;
