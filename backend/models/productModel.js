const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "dataModel",
    },
    name: {
      type: String,
      required: [true, "please add name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "please add category"],
      default: "SKU",
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "please give sku number of product"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "please give price"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "please give quantity"],
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: Object,
      required: [true, "please attach image"],
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
