const productModel = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct =  async function (req, res) {

  const { name, sku, category, price, description, image, quantity } =
    req.body;
  // validation
  if (!name || !category || !price) {
  return  res.status(400).send("Please fill the fields");
  }

  // Handling image file
  let uploadedFile;
  if (req.file) {
    try {
      // Configuration
      cloudinary.config({
        cloud_name:process.env.Cloudinary_cloud_name,
        api_key: process.env.Cloudinary_api_key,
        api_secret: process.env.Cloudinary_api_secret,
      });

      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory_App",
        resource_type: "image",
      });
    } catch {
    return  res.status(500).send("Image could not be uploaded!");
    }
  }

  let fileData = {
    fileName: req.file?.originalname,
    filePath: uploadedFile?.secure_url,
    fileType: req.file?.mimetype,
    fileSize: fileSizeFormatter(req.file?.size, 2),
  };

  // create product
  const productItem = await productModel.create({
    user: req.user.id,
    name,
    sku,
    price,
    quantity,
    category,
    description,
    image: fileData,
  });
return  res.status(201).json(productItem);
}

const getAllProducts = async (req, res) => {
  try{
  const products = await productModel.find({ user: req.user.id });
  res.status(200).json(products);
  }
  catch(e)
  {
    console.log(e)
    res.status(500).json("server error")
  }
}

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Produt  not found");
  }
  // match product id with its user id
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
}

const deleteProduct = async (req, res) => {

  try{
  const product = await productModel.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404).json("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401).json("User not authorized");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
}

catch(e)
{
  console.log(e)
  res.status(500).json("server error")
}
}

const updateProduct =   async (req, res) => {
  const { name, category, quantity, price, description } = req.body;


  const { id } = req.params;

  const product = await productModel.findById(id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      // Configuration
      cloudinary.config({
        cloud_name: "dvsviwnhl",
        api_key: "444778147113217",
        api_secret: "9hxBXDO90Cf6HZzw5PiOOUn0Vw8",
      });

      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory_App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500).json("Image could not be uploaded");
      console.log(e)
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProduct);
}


module.exports = {createProduct, getAllProducts , deleteProduct, getSingleProduct, updateProduct}