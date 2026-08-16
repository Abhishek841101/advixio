const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==========================================
// AUTH TOKEN
// ==========================================

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};


// ==========================================
// COMMON REQUEST
// ==========================================

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};


// ==========================================
// AUTH
// ==========================================

export const loginUser = async (credentials) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.success && data.data?.token) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.data.user)
    );
  }

  return data;
};


export const registerUser = async (userData) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (data.success && data.data?.token) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.data.user)
    );
  }

  return data;
};


export const logoutUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


// ==========================================
// CATEGORIES
// ==========================================

export const getCategories = async () => {
  return request("/categories");
};


// ==========================================
// PRODUCTS
// ==========================================

// Get all active products
export const getProducts = async () => {
  return request("/products");
};


// Get single product by slug
export const getProductBySlug = async (slug) => {
  return request(`/products/${slug}`);
};


// Get logged-in user's listings
export const getMyListings = async () => {
  return request("/products/my-listings");
};


// Create new product
export const createProduct = async (productData) => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};


// Update own product
export const updateProduct = async (productId, productData) => {
  return request(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};


// Delete own product
export const deleteProduct = async (productId) => {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
};


// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};


export const isLoggedIn = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem("token"));
};