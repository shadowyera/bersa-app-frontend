import axios from 'axios'
import type { User } from './auth.types'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL no está definida')
}

/**
 * Instancia base con credentials habilitado
 * Esto es CLAVE para cookies httpOnly cross-site
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

/**
 * Login
 * La cookie httpOnly se setea desde el backend
 */
export const loginRequest = async (
  email: string,
  password: string
): Promise<User> => {
  const { data } = await api.post('/login', {
    email,
    password,
  })

  return data.user
}

/**
 * Sesión actual (refresh-safe)
 */
export const meRequest = async (): Promise<User> => {
  const { data } = await api.get('/me')
  return data.user
}

/**
 * Logout
 */
export const logoutRequest = async (): Promise<void> => {
  await api.post('/logout')
}