import React, { useState } from "react"; // rafce
import "./addNewItem.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { asyncCreateProduct } from "../../redux/features/ProductSlice";
import { useDispatch} from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader.jsx";
import "./addNewItem.css";

const AddNewItem = ({loading}) => {
  const dispatch = useDispatch();
  const [previewImage, setPrviewImage] = useState(null);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const { name, category, quantity, price } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputImageHandler = (e) => {
    setImage(e.target.files[0]);
    setPrviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const generateSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || !quantity || !image) {
      return toast.error("please give all details");
    }

    const productFormData = new FormData();

    productFormData.append("name", name);
    productFormData.append("category", category);
    productFormData.append("sku", generateSKU(category));
    productFormData.append("price", Number(price));
    productFormData.append("quantity", Number(quantity));
    productFormData.append("description", description);
    productFormData.append("image", image);

    await dispatch(asyncCreateProduct(productFormData));
  };

  return (
    <div className="addContainer">
      {loading && <Loader />}
      <form
        className="addItem-form"
        onSubmit={formSubmit}
        encType="multipart/form-data"
      >
        <fieldset>
          <legend style={{ textAlign: "center" }}>
            <h2>Add New Product</h2>
          </legend>

          <div className="fieldCont">
            <label className="addLabel"> Product Image:</label>
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
              <small>No image set for this product</small>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <img alt='img'
                  src={previewImage}
                  style={{ width: "50%", height: "50%" }}
                />
              </div>
            )}
          </div>
          <hr />

          <div className="fieldCont">
            <label className="addLabel"> Product Name:</label>
            <input
              className="fieldContInput"
              type="text"
              placeholder="Product name"
              name="name"
              value={name}
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="addLabel"> Product Category:</label>
            <input    className="fieldContInput"
              type="text"
              placeholder="Product Category"
              name="category"
              value={category}
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="addLabel"> Product Price:</label>
            <input
              className="fieldContInput"
              type="text"
              placeholder="Product Price"
              name="price"
              value={price}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="fieldCont">
            <label className="addLabel"> Product Quantity:</label>
            <input
              className="fieldContInput"
              type="text"
              placeholder="Product Quantity"
              name="quantity"
              value={quantity}
              onChange={inputChangeHandler}
            />
          </div>

          <div className="fieldCont">
            <label className="addLabel"> Product Description:</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              formats={formats}
              modules={modules}
              placeholder="describe product..."
            />
          </div>
        </fieldset>
          <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
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

export default AddNewItem;
