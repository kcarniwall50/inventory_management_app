import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Sidebar from "./components/layout/Sidebar";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ResetPassword from "./pages/Reset/ResetPassword";
import AddNewItem from "./pages/AddNewItem/AddNewItem";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/EditProfile/EditProfile";
import ContactUs from "./pages/ContactUs/ContactUs";
import ProductDetail from "./pages/Product Detail/ProductDetail";
import EditProduct from "./pages/Edit Product/EditProduct";
import { useSelector } from "react-redux";

function App() {
  if (process.env.REACT_APP_NODE_ENV === "production") {
    console.log = function () {};
  }

  const isLogin = JSON.parse(localStorage.getItem("InventoryLogin"));
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.product.loading);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            exact
            path="/resetPassword/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            exact
            path="/dashboard"
            element={
              isLoggedIn || isLogin ? (
                <Sidebar>
                  <Layout>
                    <Dashboard loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/addNewItem"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <AddNewItem loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/productDetail/:id"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <ProductDetail loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/editProduct/:id"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <EditProduct loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/profile"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <Profile loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/editProfile"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <EditProfile loading={loading} />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            exact
            path="/contactUs"
            element={
              isLogin ? (
                <Sidebar>
                  <Layout>
                    <ContactUs />
                  </Layout>
                </Sidebar>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
