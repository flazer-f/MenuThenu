import React from "react";
import { useRoutes } from "react-router-dom";
import appRoutes from "./AppRoutes";
import "./App.css";

function App() {
  const routes = useRoutes(appRoutes);
  return routes;
}

export default App;
