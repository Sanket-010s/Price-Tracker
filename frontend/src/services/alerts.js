import api from './api';

export const getAlerts = async (productId = null, activeOnly = true) => {
  const params = { active_only: activeOnly };
  if (productId) params.product_id = productId;
  const response = await api.get('/alerts/', { params });
  return response.data;
};

export const createAlert = async (alertData) => {
  const response = await api.post('/alerts/', alertData);
  return response.data;
};

export const deleteAlert = async (id) => {
  const response = await api.delete(`/alerts/${id}`);
  return response.data;
};
