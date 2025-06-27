import axios from "axios";
const BASE_URL= import.meta.env.VITE_API_BASED_URL;

export const fetchProducts = async (page = 1) => {
  const limit =5;
  const skip =(page -1)*limit;
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/products?limit=${limit}&skip=${skip}&sortBy=title&order=asc`,
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to fetch products",
    };
  }
};

export const addProduct = async (product) => {
  const response = await axios({
    method: "post",
    url: `${BASE_URL}/products/add`,
    data: product,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const fetchProductById = async (productId) => {
  const response = await axios({
    method: "get",
    url: `${BASE_URL}/products/${productId}`,
  });

  return response.data;
};

export const fetchUsers = async (page=1) => {
   const limit =6;
  const skip =(page -1)*limit;
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/users?limit=${limit}&skip=${skip}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to fetch users",
    };
  }
};
export const SortUsers = async (page=1) => {
   const limit =6;
  const skip =(page -1)*limit;
  try {
    const response = await axios({
      method: "get",
      // url: `${BASE_URL}/users?limit=${limit}&skip=${skip}`,
      url:`${BASE_URL}/users?limit=${limit}&skip=${skip}&sortBy=firstName&order=asc`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to fetch users",
    };
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/users/${userId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Failed to fetch user",
    };
  }
};
