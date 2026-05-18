import api from './api';

export const getProducts = async (activeOnly = false) => {
  const response = await api.get('/products/', { params: { active_only: activeOnly } });
  return response.data;
};

export const getProduct = async (id, days = 30) => {
  const response = await api.get(`/products/${id}`, { params: { days } });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.patch(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const checkProductPrice = async (id) => {
  const response = await api.post(`/products/${id}/check`);
  return response.data;
};
