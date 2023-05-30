import axios from "axios";
import React from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./header.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Header = () => {

  const navigate = useNavigate();

  const userName = useSelector((state) => state.auth.name);
  const name = userName || localStorage.getItem("InventoryLoginUser");

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`);

      localStorage.removeItem("InventoryLogin");
      localStorage.removeItem("InventoryLoginUser");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="header-container">
      <div className="header-user-section">
        <b className="header-text">Welcome &nbsp;</b>
        <span className="header-user">{name}</span>
      </div>

      <span className="header-logout" onClick={logout}>
        Logout
      </span>
    </div>
  );
};

export default Header;
