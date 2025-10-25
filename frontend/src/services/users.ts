import type { Role, User } from '../types/user'
import { apiRequest } from './api'

export interface CreateUserPayload {
  nome: string
  email: string
  role: Role
  senha: string
  ativo: boolean
}

export interface UpdateUserPayload {
  nome: string
  email: string
  role: Role
  ativo: boolean
}

export function listUsers() {
  return apiRequest<User[]>('/usuarios')
}

export function createUser(payload: CreateUserPayload) {
  return apiRequest<User>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateUser(id: string, payload: UpdateUserPayload) {
  return apiRequest<User>(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteUser(id: string) {
  return apiRequest<void>(`/usuarios/${id}`, {
    method: 'DELETE',
    parseJson: false,
  })
}
