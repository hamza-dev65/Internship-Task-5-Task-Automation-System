import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getInterns = () => api.get('/interns').then(r => r.data);
export const getIntern = (id) => api.get(`/interns/${id}`).then(r => r.data);
export const createIntern = (data) => api.post('/interns', data).then(r => r.data);
export const updateIntern = (id, data) => api.put(`/interns/${id}`, data).then(r => r.data);
export const deleteIntern = (id) => api.delete(`/interns/${id}`).then(r => r.data);

export const getTasks = (params) => api.get('/tasks', { params }).then(r => r.data);
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status }).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);

export const getStats = () => api.get('/tasks/stats').then(r => r.data);

export const getReminders = (params) => api.get('/reminders', { params }).then(r => r.data);
export const markReminderRead = (id) => api.patch(`/reminders/${id}/read`).then(r => r.data);
