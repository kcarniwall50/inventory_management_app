import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// create new product
export const asyncCreateProduct = createAsyncThunk(
  "product/asyncCreateProduct",
  async (productFormData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/createProduct`,
        productFormData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// get all products
export const asyncGetProducts = createAsyncThunk(
  "product/asyncGetProducts",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/getProducts`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// get single product
export const asyncGetProduct = createAsyncThunk(
  "product/asyncGetProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/getProduct/` + id, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// delete product
export const asyncDeleteProduct = createAsyncThunk(
  "product/asyncDeletProduct",

  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/deleteProduct/` + id,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// update product
export const asyncUpdateProduct = createAsyncThunk(
  "product/asyncUpdateProduct",

  async ({ id, productFormData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/updateProduct/` + id,
        productFormData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loading: false,
  products: [],
  product: {},
  message: "",
  IsLogin: false,
  outOfStocks: 0,
  totalStoreValue: 0,
  category: 0,
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    Out_Of_Stocks(state, action) {
      const { userProducts } = action.payload;
      const temp = userProducts.filter(
        (product) => product.quantity === 0 || product.quantity === "0"
      );

      state.outOfStocks = temp;
    },

    Total_Store_Value(state, action) {
      const { userProducts } = action.payload;
      let total = 0;
      userProducts.map((product) => {
        total = total + product.price * product.quantity;
      });

      state.totalStoreValue = total;
    },

    All_Categories(state, action) {
      const { userProducts } = action.payload;
      const array = [];
      userProducts.map((item) => {
        const { category } = item;
        array.push(category);
      });
      const uniqueCategory = [...new Set(array)];
      state.category = uniqueCategory;
    },

    Set_Loading(state, action) {
      state.loading=action.payload
    },

  },

  extraReducers: (builder) => {
    builder
      // create new product
      .addCase(asyncCreateProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        toast.success("Product Added Successfully");
      })

      .addCase(asyncCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // delete product
      .addCase(asyncDeleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Product deleted successfully");
      })

      .addCase(asyncDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.message = action.payload;
      })

      // get all products
      .addCase(asyncGetProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncGetProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(asyncGetProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.message = action.payload;
      })

      // get single product
      .addCase(asyncGetProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncGetProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })

      .addCase(asyncGetProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.message = action.payload;
      })

      // update product
      .addCase(asyncUpdateProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        toast.success("Product updated successfully");
      })

      .addCase(asyncUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.message = action.payload;
      });
  },
});

export const { Out_Of_Stocks, Total_Store_Value, All_Categories , Set_Loading} =
  ProductSlice.actions;
export const selectProducts = (state) => state.product.products;
export const selectProduct = (state) => state.product.product;
export const selectoutOfStocks = (state) => state.product.outOfStocks;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectAllCategories = (state) => state.product.category;

export default ProductSlice.reducer;
