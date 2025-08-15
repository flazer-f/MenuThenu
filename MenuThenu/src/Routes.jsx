import React from 'react';
import { Routes, Route } from 'react-router-dom';
import appRoutes from './AppRoutes.jsx';

const AppRoutes = () => (
  <Routes>
    {appRoutes.map(({ path, element }, idx) => (
      <Route key={idx} path={path} element={element} />
    ))}
  </Routes>
);

export default AppRoutes;