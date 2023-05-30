import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useParams } from "react-router-dom";
import {
  asyncGetProduct,
  selectProduct,
} from "../../redux/features/ProductSlice";
import "./productDetail.css";
import Parser from "html-react-parser";
import Loader from "../../utils/Loader";

const ProductDetail = ({loading}) => {
 
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);

  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncGetProduct(id));
  }, [dispatch, id]);

  return (
    <div className="product-detail-container">
      {loading && <Loader/>}
      <h2>Product Detail</h2>
      {product?.image ? (
        <div className="image-container">
          <img
            className="product-image"
            src={product.image.filePath}
            alt="img"
          />{" "}
        </div>
      ) : (
        <p> Image is not set for this product </p>
      )}

      <div style={{ marginBottom: "0.5rem", marginLeft:'1rem' }}>
        <b>Product Avaiability:&nbsp; &nbsp;</b>
        {Number(product.quantity) > 0 ? (
          <span style={{ color: "green" }}>In Stock</span>
        ) : (
          <span style={{ color: "red" }}>Out of Stock</span>
        )}
      </div>
      <hr />
      <div>
        <div className="product-detail">
          <big> <b>&rarr; Name:</b></big> &nbsp; &nbsp;
          <big style={{ fontWeight: "", fontSize: "20px" }}>
            {" "}
            {product.name}
          </big>
        </div>
        <div className="product-detail">
          <b>&rarr; SKU:</b>&nbsp; &nbsp;{product.sku}
        </div>
        <div className="product-detail">
          <b>&rarr; Category:</b>&nbsp; &nbsp;{product.category}
        </div>
        <div className="product-detail">
          <b>&rarr; Price:</b>&nbsp; &nbsp;₹{product.price}
        </div>
        <div className="product-detail">
          <b>&rarr; Quantity in Stock:</b>
          &nbsp; &nbsp;  {product.quantity}
        </div>
        <div className="product-detail">
          <b>&rarr; Total value in stock:</b>&nbsp; &nbsp;₹
          {product.price * product.quantity}
        </div>
        <hr />
        <div className="product-detail">
          <b>&rarr; Description:</b>
          <br />
          <div className="detDes"
           
          >
            {Parser(`${product?.description}`)}
          </div>
        </div>
        <div className="product-detail">
          <code>Created on:&nbsp; &nbsp; {product.createdAt}</code>
          <br />
          <code>Last Updated:&nbsp; &nbsp;{product.updatedAt}</code>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
