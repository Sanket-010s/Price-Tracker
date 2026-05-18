import api from './api';

export const getNotifications = async (skip = 0, limit = 100) => {
  const response = await api.get('/notifications/', { params: { skip, limit } });
  return response.data;
};
