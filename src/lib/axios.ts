import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach token ke setiap request
api.interceptors.request.use((config) => {
  // ambil dari auth-storage (zustand persist)
  const authStorage = localStorage.getItem("auth-storage")
  const token = authStorage
    ? JSON.parse(authStorage)?.state?.token
    : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle 401 — token expired / invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api;