import React from 'react';

import MenuCreator from './components/createmenu/MenuCreator';
import Dashboard from './components/dashboard/AdminDashboard';
import MenuList from './components/dashboard/MenuList';
import Layout from './components/dashboard/Layout';
import MainLayout from './components/layout/MainLayout';
import Hero from './components/homepage/Hero';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const appRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Hero /> },  // Homepage content
      { path: "MenuCreator", element: <MenuCreator /> },  // Demo route with same header/footer
      { path: "register", element: <Register /> }, // Registration route
      { path: "login", element: <Login /> }, // Login route
    ]
  },
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