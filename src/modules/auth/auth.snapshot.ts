import type { User } from './auth.types'

let authSnapshot: { user: User | null } = {
  user: null,
}

export function setAuthSnapshot(user: User | null) {
  authSnapshot.user = user
}

export function getAuthSnapshot() {
  return authSnapshot
}