import React from "react";
import "./home.css";
import hero from "../../assets/inv-img.png";
import { Link } from "react-router-dom";
import { FaKickstarterK } from "react-icons/fa";

const Home = () => {
  const logged = JSON.parse(localStorage.getItem("InventoryLogin"));
  return (
    <>
      <ul className="nav-container">
        <div className="logo-container">
          <li className="li logo">
            <Link className="li-item" to="/">
              <FaKickstarterK size="30px" color="blue" />
            </Link>
          </li>
        </div>

        <div className="nav-page-container">
          {logged ? (
            <li className="li">
              <Link className="nav-li-item nav-dashboard" to="/dashboard">
                Dashboard
              </Link>
            </li>
          ) : (
            <>
              <li className="li">
                <Link className="nav-li-item nav-register" to="/register">
                  Register
                </Link>
              </li>

              <li className="li">
                <Link className="nav-li-item nav-login" to="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
      <div className="home-container">
        <section className="text-section">
          <h1 className="main-heading">
            Inventroy & Stock Management Solution
          </h1>
          <p className="para1">
            Inventroy system to control and manage products in the warehouse in
            real time and integrated to make it easier to develop your business
          </p>

          <b className="bold1">Free trial 1 Month</b>

          <div className="parent-container">
            <div className="child-container">
              <h3 className="child-heading">14K</h3>
              <p className="child-para">Brand Owners</p>
            </div>

            <div className="child-container">
              <h3 className="child-heading">23K</h3>
              <p className="child-para">Active Users</p>
            </div>

            <div className="child-container">
              <h3 className="child-heading">500+</h3>
              <p className="child-para">Partners</p>
            </div>
          </div>
        </section>

        <section className="photo-section">
          <img src={hero} alt="hero" />
        </section>
      </div>
    </>
  );
};

export default Home;
