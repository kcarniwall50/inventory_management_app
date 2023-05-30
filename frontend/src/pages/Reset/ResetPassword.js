import axios from "axios";
import React, { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./resetPassword.css";
import Loader from "../../utils/Loader";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = ({loading}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    conPassword: "",
  });

  const { password, conPassword } = formData;
  const { resetToken } = useParams();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetpassword = async (e) => {
    e.preventDefault();

    if (!password || !conPassword) {
      return toast.error("Please enter password");
    }

    if (password.length < 6) {
      return toast.error("Password length can not be less than 6");
    }

    if (password !== conPassword) {
      return toast.error("Passwords did not match");
    }
    const userData = {
      password,
    };
    try {
      const response = await axios.put(
        `${BACKEND_URL}/user/resetPassword/${resetToken}`,
        userData
      );
      toast.success(response.data.message);
      navigate("/login");
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
        <h2>Reset Password</h2>
      </div>

      <form className="forgotPassword-form" onSubmit={resetpassword}>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={inputChangeHandler}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="conPassword"
          value={conPassword}
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

export default ResetPassword;
