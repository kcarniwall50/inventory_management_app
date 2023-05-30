import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import "./layout.css";

const Layout = ({ children }) => {

  return (
    <div className="layout-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
