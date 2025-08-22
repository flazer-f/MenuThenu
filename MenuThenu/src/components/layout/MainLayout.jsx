import React from "react";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import { Outlet } from "react-router-dom";

// This component provides a consistent layout with header and footer
// while allowing the middle content to change
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
