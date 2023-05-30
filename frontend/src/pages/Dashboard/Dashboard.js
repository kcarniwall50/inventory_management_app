import React, { useEffect, useState } from "react";
import "./dashboard.css";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import {
  All_Categories,
  asyncDeleteProduct,
  asyncGetProducts,
  Out_Of_Stocks,
  selectAllCategories,
  selectoutOfStocks,
  selectProducts,
  selectTotalStoreValue,
  Total_Store_Value,
} from "../../redux/features/ProductSlice";
import { Filter_Products } from "../../redux/features/filterSlice";
import ReactPaginate from "react-paginate";
import { RiDashboardLine } from "react-icons/ri";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BsCartX } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { TiEdit } from "react-icons/ti";

import { BsTrashFill } from "react-icons/bs";
import { AiOutlineEye } from "react-icons/ai";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loader from "../../utils/Loader";

const Dashboard = ({loading}) => {
  const dispatch = useDispatch();


  let color1 = "white";
  let color2 = "#dfdcdc";

  const userProducts = useSelector(selectProducts);

  useEffect(() => {
    dispatch(asyncGetProducts());
  }, [dispatch]);

  const [searchValue, setSearchValue] = useState("");

  const filteredProducts = useSelector(
    (state) => state.filter.filteredProducts
  );

  useEffect(() => {
    dispatch(Filter_Products({ userProducts, searchValue }));
  }, [searchValue, dispatch, userProducts]);

  // pagination starts -------------------------------------------

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [
    itemOffset,
    itemsPerPage,
    filteredProducts,
    searchValue,
    userProducts,
  ]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  // pagination ends

  const delProduct = async (id) => {
    await dispatch(asyncDeleteProduct(id));
    await dispatch(asyncGetProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  // out of stock
  const outOfStockArray = useSelector(selectoutOfStocks);
  useEffect(() => {
    dispatch(Out_Of_Stocks({ userProducts }));
  }, [dispatch, userProducts]);

  // total store value
  const totalStoreValue = useSelector(selectTotalStoreValue);
  useEffect(() => {
    dispatch(Total_Store_Value({ userProducts }));
  }, [dispatch, userProducts]);

  // all categories
  const allCategoriesArray = useSelector(selectAllCategories);
  useEffect(() => {
    dispatch(All_Categories({ userProducts }));
  }, [dispatch, userProducts]);

  return (
    <div className="dashboard-container">
      {loading && <Loader/>}
      <h2 style={{ textAlign: "center", margin: "1rem 0px" }}>
        Inventory Stats{" "}
      </h2>
      <div className="inventory-container">
        <div className="inventory-items1">
          <GiShoppingCart className="cart-icon" size="30" />
          <div style={{ marginInline: "0.5rem" }}>
            <p>Total Products</p>{" "}
            <p style={{ textAlign: "center" }}>{userProducts.length}</p>
          </div>
        </div>

        <div className="inventory-items2">
          <BsCartX className="cart-icon" size="30" />
          <div style={{ marginInline: "0.5rem" }}>
            <p>Out of Stocks</p>{" "}
            <p style={{ textAlign: "center" }}>{outOfStockArray.length}</p>
          </div>
        </div>

        <div className="inventory-items3">
          <AiOutlineDollarCircle className="cart-icon" size="30" />
          <div style={{ marginInline: "0.5rem" }}>
            <p>Total Store Value</p>{" "}
            <p style={{ textAlign: "center" }}>₹{totalStoreValue}</p>
          </div>
        </div>

        <div className="inventory-items4">
          <RiDashboardLine className="cart-icon" size="30" />
          <div style={{ marginInline: "0.5rem" }}>
            <p>All Categories</p>{" "}
            <p style={{ textAlign: "center" }}>{allCategoriesArray.length}</p>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <h3>Inventory Items</h3>
        <div>
          <input
            style={{ fontFamily: "Arial, FontAwesome", padding: "0.2rem 0.6rem", border:'1px solid grey', borderRadius:'24px' }}
            type="text"
            placeholder="&#xF002; Search by name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <hr
        style={{
          borderColor: "blue",
          size: "60%",
          width: "95%",
          margin: "1rem 0rem 0.2rem 0rem",
        }}
      />
      {userProducts.length > 0 ? (
        <table
          style={{ marginTop: "0.5rem", width: "95%", marginInline: "auto" }}
        >
          <thead style={{}}>
            <tr
              style={{
                display: "grid",
                gridTemplateColumns:
                  "14.3% 14.3% 14.3% 14.3% 14.3% 14.3% 14.3%",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              <td>S/N</td>
              <td>Name</td>
              <td>Category</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Value</td>
              <td>Action</td>
            </tr>
          </thead>

          <tbody style={{ marginTop: "2rem" }}>
            {currentItems.length > 0 &&
              currentItems.map((item, index) => (
                <tr
                  style={{
                    display: "grid",
                    marginBottom: "0.5rem",
                    gridTemplateColumns:
                      "14.3% 14.3% 14.3% 14.3% 14.3% 14.3% 14.3%",
                    backgroundColor: index % 2 === 0 ? color1 : color2,
                    padding: "0.5rem",
                  }}
                  key={index}
                >
                  <td>{itemOffset + 1 + index}.</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price} </td>
                  <td>{item.quantity} </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <Link to={`/productDetail/${item._id}`}>
                      <AiOutlineEye
                        style={{ cursor: "pointer" }}
                        color="blue"
                      />
                    </Link>

                    <Link to={`/editProduct/${item._id}`}>
                      <TiEdit
                        style={{ marginInline: "0.3rem", cursor: "pointer" }}
                        color="green"
                      />
                    </Link>

                    <BsTrashFill
                      style={{ cursor: "pointer" }}
                      color="red"
                      size="13"
                      onClick={() => confirmDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center" }}>
          You dont have any product, Add a product
        </p>
      )}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="pagination__link"
        disabledClassName={"pagination__link--disabled"}
        nextLinkClassName="pagination__link"
        activeLinkClassName="pagination__link--active"
      />
    </div>
  );
};

export default Dashboard;
