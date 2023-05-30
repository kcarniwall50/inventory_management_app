import axios from "axios";
import React, { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./forgotPassword.css";
import Loader from "../../utils/Loader";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = ({loading}) => {

  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const forgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter email");
    }

    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    // backend communication
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/forgotPassword`,
        formData
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="forgotPassword-container">  
    {loading && <Loader/>}
      <div className="forgotPasswor-icon-text">
        <div className="forgotPassword-icon">
          <RiLockPasswordFill size="25" color="blue" />
        </div>
        <h2>Forgot Password</h2>
      </div>

      <form className="forgotPassword-form" onSubmit={forgotPassword}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={inputChangeHandler}
        />

        <button className="forgotPassword-submit">Reset Password</button>
      </form>
      <div className="forgotPassword-redirect-link">
        <Link className="redirect-home" to="/">
          -Home
        </Link>
        <Link className="redirect-home" to="/login">
          -Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
