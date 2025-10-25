export type Role = 'ADMIN' | 'RH' | 'GESTOR' | 'FUNCIONARIO'

export interface User {
  id: string
  nome: string
  email: string
  role: Role
  ativo: boolean
  createdAt: string
  updatedAt: string
  senhaHash?: string
}

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Administrador',
  RH: 'Recursos Humanos',
  GESTOR: 'Gestor',
  FUNCIONARIO: 'Funcionario',
}
