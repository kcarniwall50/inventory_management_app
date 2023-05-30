import React, { useEffect, useState } from "react"; // rafce
import "./editProduct.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  asyncGetProduct,
  asyncUpdateProduct,
} from "../../redux/features/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import Parser from "html-react-parser";
import "./editProduct.css";
import Loader from "../../utils/Loader";

const EditProduct = ({loading}) => {
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const { name, category, quantity, price } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // getting single product
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.product);

  const { id } = useParams();

  useEffect(() => {
    setPreviewImage(product?.image?.filePath);
    const getProduct = async () => {
      await dispatch(asyncGetProduct(id));
      setPreviewImage(product?.image?.filePath);

      if (product) {
        setFormData(product);
        setPreviewImage(product?.image?.filePath);
      }
      setPreviewImage(product?.image?.filePath);
    };
    getProduct();
  }, [dispatch, id]);

  const inputImageHandler = (e) => {
    setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const generateSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const productFormData = new FormData();
    productFormData.append("name", name || product?.name);

    productFormData.append("category", category || product?.category);

    productFormData.append("sku", generateSKU(category || product?.category));
    productFormData.append("price", Number(price || product?.price));
    productFormData.append(
      "quantity",
      Number(quantity) || Number(product?.quantity)
    );
    productFormData.append("description", description || product?.description);
    productFormData.append("image", image || product?.image?.filePath);
    await dispatch(asyncUpdateProduct({ id, productFormData }));
  };

  // const detail = <div>{Parser(product?.description + "")}</div>;

  // const demo = (
  //   <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
  // );

  return (
    <div className="editContainer">
      {loading && <Loader/>}
      <form
        className="edit-form"
        onSubmit={formSubmit}
        encType="multipart/form-data"
      >
        <fieldset>
          <legend style={{ textAlign: "center" }}>
            <h2>Edit Product</h2>
          </legend>

          <div className="fieldCont">
            <label className="editLabel"> Product Image:</label>

            <input
              className="fieldContInput"
              type="file"
              name="image"
              onChange={inputImageHandler}
            />

            <code>
              <small>Supported Formats: jpg, jpeg, png</small>
            </code>
            {previewImage === null ? (
              <p>No image set for this product</p>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <img alt='img'
                  src={previewImage || product?.image?.filePath}
                  style={{ width: "50%", height: "50%" }}
                />
              </div>
            )}
          </div>
          <hr />
          <div className="fieldCont">
            <label className="editLabel"> Product Name:</label>
            <input
              className="fieldContInput"
              type="text"
              name="name"
              defaultValue={product?.name}
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="editLabel"> Product Category:</label>
            <input
              className="fieldContInput"
              type="text"
              defaultValue={product?.category}
              name="category"
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="editLabel"> Product Price:</label>
            <input
              className="fieldContInput"
              type="text"
              defaultValue={product?.price}
              name="price"
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="editLabel"> Product Quantity:</label>
            <input
              className="fieldContInput"
              type="text"
              name="quantity"
              defaultValue={product?.quantity}
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="editLabel"> Product Description:</label>
            <ReactQuill
              theme="snow"
              placeholder="describe product.."
              onChange={setDescription}
              modules={modules}
              formats={formats}
            />
          </div>
        </fieldset>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default EditProduct;
