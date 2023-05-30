import axios from "axios";
import React, { useState } from "react";
import { MdOutlineLogin } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.css";
import Loader from "../../utils/Loader";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/features/auth/AuthSlice";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = ({loading}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function login(e) {
    e.preventDefault();

    // verification

    if (!email || !password) {
      return toast.error("Fields can not be empty");
    }

    // validate email

    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/user/login`, formData, {
        withCredentials: true,
      });


      if (response.status === 200) {
        toast.success("login successful");
      }
dispatch(setLogin(true))
 localStorage.setItem("InventoryLoginUser", response.data.name);

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="login-icon-text">
        <div className="login-icon">
          <MdOutlineLogin size="25" color="blue" />
        </div>
        <h2>Login</h2>
      </div>

      <form className="login-form" onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={inputChangeHandler}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={inputChangeHandler}
        />

        <button className="login-submit">Login</button>
      </form>
      <div className="login-redirect-link">
        <Link className="redirect-home" to="/forgotPassword">
          Forgot Password
        </Link>
        <span> &nbsp; Don't have account? &nbsp; </span>
        <Link className="redirect-home" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
