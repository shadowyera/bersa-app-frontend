import axios from 'axios'
import type { User } from './auth.types'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Login
 * La cookie httpOnly se setea desde el backend
 */
export const loginRequest = async (
  email: string,
  password: string
): Promise<User> => {
  const { data } = await axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    {
      withCredentials: true, // 🔥 CLAVE
    }
  )

  return data.user
}

/**
 * Sesión actual (refresh-safe)
 */
export const meRequest = async (): Promise<User> => {
  const { data } = await axios.get(
    `${API_URL}/auth/me`,
    {
      withCredentials: true,
    }
  )

  return data.user
}

/**
 * Logout
 */
export const logoutRequest = async () => {
  await axios.post(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  )
}