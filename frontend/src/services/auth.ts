import type { User } from '../types/user'
import { apiRequest } from './api'

export interface LoginPayload {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  nome: string
  email: string
  senha: string
  role?: string
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })
}

export function getProfile() {
  return apiRequest<User>('/auth/me')
}

export function register(payload: RegisterPayload) {
  return apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  })
}
