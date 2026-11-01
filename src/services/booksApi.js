import { request } from './http.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Aceita objeto completo (POST) ou parcial (PATCH): só inclui o que veio
const toPayload = ({ title, author, status, rating }) => ({
  ...(title !== undefined && { title: title.trim() }),
  ...(author !== undefined && { author: author.trim() }),
  ...(status !== undefined && { status }),
  ...(rating !== undefined && { rating: Number(rating) || 0 }),
});

export const fetchBooks = (signal) => request(`${BASE_URL}/books?_sort=id&_order=desc`, { signal });
export const fetchBook = (id, signal) => request(`${BASE_URL}/books/${id}`, { signal });
export const createBookRequest = (data) =>
  request(`${BASE_URL}/books`, { method: 'POST', body: toPayload(data) });
export const updateBookRequest = (id, changes) =>
  request(`${BASE_URL}/books/${id}`, { method: 'PATCH', body: toPayload(changes) });
export const removeBookRequest = (id) => request(`${BASE_URL}/books/${id}`, { method: 'DELETE' });
