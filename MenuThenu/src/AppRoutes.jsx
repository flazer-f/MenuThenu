import React from 'react';

import MenuCreator from './components/createmenu/MenuCreator';
import Dashboard from './components/dashboard/AdminDashboard';

const appRoutes = [
  { path: '/', element: <MenuCreator /> },
  { path: '/dashboard', element: <Dashboard /> }
];

export default appRoutes;