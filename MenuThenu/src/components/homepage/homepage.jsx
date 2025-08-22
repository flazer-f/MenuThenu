import React from "react";
import { Outlet } from "react-router-dom";

// HomePage now just acts as a container for the content being rendered by the router
export default function HomePage() {
  return <Outlet />;
}
