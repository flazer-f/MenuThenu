import React from 'react';

import MenuCreator from './components/createmenu/MenuCreator';
import Dashboard from './components/dashboard/AdminDashboard';
import MenuList from './components/dashboard/MenuList'
import Layout from './components/dashboard/Layout'


const appRoutes = [
  { path: '/', element: <MenuCreator /> },
   {
    path: "/admin",       // base route for layout
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> }, // /admin/dashboard
      { path: "menulist", element: <MenuList /> },   // /admin/menulist
    ],
  },

];

export default appRoutes;