import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // 🔥 CLAVE
})

/* ================================
   RESPONSE → manejar sesión caída
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ❌ NO borrar nada
      // ❌ NO leer localStorage
      // ❌ NO forzar redirect global acá

      console.warn('[API] 401 Unauthorized')
    }

    return Promise.reject(error)
  }
)