import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./register.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin, setUser } from "../../redux/features/auth/AuthSlice";
import Loader from "../../utils/Loader";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Register = ({loading}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    conPassword: "",
  });

  const { name, email, password, conPassword } = formData;

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function register(e) {
    e.preventDefault();

    // verification of inputs
    if (!name || !email || !password || !conPassword) {
      return toast.error("Please fill up all fields");
    }

    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };

    // validation of email
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    if (password.length < 6) {
      return toast.error("Password length can not be less than 6");
    }

    if (password !== conPassword) {
      return toast.error("Passwords did not match");
    }

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/register`,
        userData,
        { withCredentials: true }
      );
      if (response.statusText === "Created") {
        toast.success("User Registered successfully");
      }

      await dispatch(setLogin(true));
      await dispatch(setUser(response.data));
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  return (
    <div className="register-container">
      {loading && <Loader/>}
      <div className="register-icon-text">
        <div className="register-icon">
          <FaUserPlus size="25" color="blue" />
        </div>
        <h2>Register</h2>
      </div>

      <form className="register-form" onSubmit={register}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={inputChangeHandler}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          name="conPassword"
          value={conPassword}
          onChange={inputChangeHandler}
        />
        <button className="register-submit">Register</button>
      </form>

      <div className="register-redirect-link">
        <Link className="redirect-home" to="/">
          Home
        </Link>
        <span> &nbsp; Already have account? &nbsp; </span>
        <Link className="redirect-home" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
