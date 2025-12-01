import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Empleados
export const empleadosAPI = {
  getAll: () => api.get('/empleados'),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  delete: (id) => api.delete(`/empleados/${id}`),
};

// Convenios
export const conveniosAPI = {
  getAll: () => api.get('/convenios'),
  getById: (id) => api.get(`/convenios/${id}`),
  getCategorias: (id) => api.get(`/convenios/${id}/categorias`),
};

// Liquidación
export const liquidacionAPI = {
  calcular: (data) => api.post('/liquidacion/calcular', data),
  guardar: (data) => api.post('/liquidacion/guardar', data),
  getById: (id) => api.get(`/liquidacion/${id}`),
  getByEmpleado: (empleadoId) => api.get(`/liquidacion/empleado/${empleadoId}`),
  getByPeriodo: (periodo) => api.get(`/liquidacion/periodo/${periodo}`),
};

// Recibos
export const recibosAPI = {
  getById: (id) => api.get(`/recibos/${id}`),
};

export default api;

