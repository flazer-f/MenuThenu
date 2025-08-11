import React,{ StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import CreateMenu from "./components/createmenu/CreateMenu";
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
