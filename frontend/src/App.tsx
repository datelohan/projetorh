import { useEffect, useMemo, useState } from 'react'
import type { Role, User } from './types/user'
import { roleLabels } from './types/user'
import { UserTable } from './components/UserTable'
import { UserForm, type UserFormValues } from './components/UserForm'
import { LoginForm } from './components/LoginForm'
import { createUser, deleteUser, listUsers, updateUser } from './services/users'
import { getProfile, login, register, type LoginPayload, type RegisterPayload } from './services/auth'
import { getStoredToken, setStoredToken } from './services/tokenStorage'

type RoleFilter = Role | 'ALL'

const roleFilterOptions: { value: RoleFilter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ADMIN', label: 'Administradores' },
  { value: 'RH', label: 'RH' },
  { value: 'GESTOR', label: 'Gestores' },
  { value: 'FUNCIONARIO', label: 'Funcionarios' },
]

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [formStatus, setFormStatus] = useState<{ submitting: boolean; error: string | null }>(
    { submitting: false, error: null },
  )
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(() => getStoredToken())
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(() => !!getStoredToken())
  const [authError, setAuthError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const storedToken = getStoredToken()
    if (!storedToken) {
      setAuthLoading(false)
      return
    }

    void hydrateSession(storedToken)
  }, [])

  useEffect(() => {
    if (!actionMessage) return
    const timeout = window.setTimeout(() => setActionMessage(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [actionMessage])

  async function hydrateSession(token: string) {
    setAuthLoading(true)
    setAuthError(null)
    setStoredToken(token)
    setSessionToken(token)
    try {
      const profile = await getProfile()
      setCurrentUser(profile)
      await loadUsers()
      setAuthMode('login')
    } catch (error) {
      const message = isUnauthorized(error)
        ? 'Sessao expirada. Entre novamente.'
        : getErrorMessage(error)
      handleLogout(message)
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout(message?: string) {
    setStoredToken(null)
    setSessionToken(null)
    setCurrentUser(null)
    setUsers([])
    setFormOpen(false)
    setSelectedUser(null)
    setFormStatus({ submitting: false, error: null })
    setPageError(null)
    setActionMessage(null)
    setLoading(false)
    setAuthLoading(false)
    setAuthError(message ?? null)
    setAuthMode('login')
  }

  async function loadUsers() {
    if (!getStoredToken()) {
      setUsers([])
      return
    }

    setLoading(true)
    setPageError(null)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch (error) {
      if (isUnauthorized(error)) {
        handleLogout('Sessao expirada. Entre novamente.')
        return
      }
      setPageError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(credentials: LoginPayload) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { token, user } = await login(credentials)
      setStoredToken(token)
      setSessionToken(token)
      setCurrentUser(user)
      setPageError(null)
      await loadUsers()
      setActionMessage('Sessao iniciada com sucesso.')
      setAuthMode('login')
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleRegister(payload: RegisterPayload) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { token, user } = await register(payload)
      setStoredToken(token)
      setSessionToken(token)
      setCurrentUser(user)
      setPageError(null)
      await loadUsers()
      setActionMessage('Conta criada com sucesso.')
      setAuthMode('login')
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleSubmit(values: UserFormValues) {
    setFormStatus({ submitting: true, error: null })

    try {
      if (selectedUser) {
        const updated = await updateUser(selectedUser.id, {
          nome: values.nome,
          email: values.email,
          role: values.role,
          ativo: values.ativo,
        })
        setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)))
        setActionMessage('Usuario atualizado com sucesso.')
      } else {
        const created = await createUser({
          nome: values.nome,
          email: values.email,
          role: values.role,
          ativo: values.ativo,
          senha: values.senha.trim(),
        })
        setUsers((prev) => [created, ...prev])
        setActionMessage('Usuario cadastrado com sucesso.')
      }
      setFormOpen(false)
      setSelectedUser(null)
      setFormStatus({ submitting: false, error: null })
    } catch (error) {
      if (isUnauthorized(error)) {
        setFormStatus({ submitting: false, error: null })
        handleLogout('Sessao expirada. Entre novamente.')
        return
      }
      setFormStatus({ submitting: false, error: getErrorMessage(error) })
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user)
    setFormStatus({ submitting: false, error: null })
    setFormOpen(true)
  }

  async function handleDelete(userToRemove: User) {
    const confirmation = window.confirm(`Deseja realmente excluir ${userToRemove.nome}?`)
    if (!confirmation) return

    try {
      await deleteUser(userToRemove.id)
      setUsers((prev) => prev.filter((user) => user.id !== userToRemove.id))
      setActionMessage('Usuario removido.')
    } catch (error) {
      if (isUnauthorized(error)) {
        handleLogout('Sessao expirada. Entre novamente.')
        return
      }
      setPageError(getErrorMessage(error))
    }
  }

  async function handleToggleActive(userToUpdate: User) {
    try {
      const updated = await updateUser(userToUpdate.id, {
        nome: userToUpdate.nome,
        email: userToUpdate.email,
        role: userToUpdate.role,
        ativo: !userToUpdate.ativo,
      })
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)))
    } catch (error) {
      if (isUnauthorized(error)) {
        handleLogout('Sessao expirada. Entre novamente.')
        return
      }
      setPageError(getErrorMessage(error))
    }
  }

  function openCreateDrawer() {
    setSelectedUser(null)
    setFormStatus({ submitting: false, error: null })
    setFormOpen(true)
  }

  function dismissPageError() {
    setPageError(null)
  }

  function switchAuthMode(mode: 'login' | 'register') {
    setAuthMode(mode)
    setAuthError(null)
    setAuthLoading(false)
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesQuery = query
        ? [user.nome, user.email, roleLabels[user.role]].some((field) => field.toLowerCase().includes(query))
        : true
      const matchesRole = roleFilter === 'ALL' ? true : user.role === roleFilter
      return matchesQuery && matchesRole
    })
  }, [users, search, roleFilter])

  const stats = useMemo(() => {
    const total = users.length
    const ativos = users.filter((user) => user.ativo).length
    return {
      total,
      ativos,
      inativos: total - ativos,
      ultimoCadastro: users
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.nome,
    }
  }, [users])

  const isAuthenticated = Boolean(sessionToken && currentUser)
  const isHydrating = authLoading && !!sessionToken && !currentUser

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-40 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-primary-900/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-24 pt-10 lg:px-12">
        {isAuthenticated ? (
          <>
            {(pageError || actionMessage) && (
              <div className="mb-6 flex flex-col gap-3">
                {pageError && (
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                    <span>{pageError}</span>
                    <button
                      type="button"
                      onClick={dismissPageError}
                      className="rounded-full border border-rose-200/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-100 transition hover:border-rose-200/60"
                    >
                      Fechar
                    </button>
                  </div>
                )}
                {actionMessage && !pageError && (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-100">
                    {actionMessage}
                  </div>
                )}
              </div>
            )}

            {currentUser && (
              <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/80 px-6 py-5 text-sm text-slate-300 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Sessao ativa</p>
                  <p className="mt-1 text-xl font-semibold text-white">{currentUser.nome}</p>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLogout()}
                  className="rounded-full border border-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                >
                  Sair
                </button>
              </div>
            )}

            <header className="flex flex-col gap-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-200/80">
                  Projeto RH
                </span>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                  Central de colaboradores
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Cadastre novos usuarios, atribua perfis de acesso e acompanhe a atividade de cada colaborador com um dashboard enxuto e moderno.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total de usuarios" value={stats.total.toString()} accent="bg-primary-500/20" trend={`+${stats.total > 9 ? '12%' : '5%'}`} />
                <StatCard label="Usuarios ativos" value={stats.ativos.toString()} accent="bg-emerald-500/20" trend={`${stats.ativos} online`} />
                <StatCard label="Usuarios inativos" value={stats.inativos.toString()} accent="bg-rose-500/20" trend={`${stats.inativos} aguardando`} />
                <StatCard label="Ultimo cadastro" value={stats.ultimoCadastro ?? 'Sem registros'} accent="bg-accent/20" trend={new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date())} />
              </div>
            </header>

            <main className="mt-12 flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/5 bg-white/5/30 px-6 py-6 backdrop-blur lg:flex-row lg:items-center">
                <div className="flex flex-1 flex-wrap items-center gap-4">
                  <div className="relative w-full max-w-sm">
                    <SearchIcon />
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/60 pl-11 pr-4 py-3 text-sm text-white outline-none transition focus:border-primary-400"
                      placeholder="Buscar por nome ou email"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      type="search"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roleFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRoleFilter(option.value)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                          roleFilter === option.value
                            ? 'bg-primary-500 text-white shadow-soft'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={openCreateDrawer}
                  className="self-start rounded-full bg-primary-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:bg-primary-400"
                  type="button"
                >
                  Novo usuario
                </button>
              </div>

              <UserTable
                users={filteredUsers}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            </main>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center py-20">
            {isHydrating ? (
              <div className="flex flex-col items-center gap-4 text-slate-300">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                <p className="text-sm">Validando sessao...</p>
              </div>
            ) : (
              <LoginForm
                mode={authMode}
                loading={authLoading}
                errorMessage={authError}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onSwitchMode={switchAuthMode}
              />
            )}
          </div>
        )}
      </div>

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedUser}
        submitting={formStatus.submitting}
        errorMessage={formStatus.error}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  accent: string
  trend: string
}

function StatCard({ label, value, accent, trend }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-slate-900/80 px-5 py-6 text-slate-300 shadow-soft backdrop-blur">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</span>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold text-white">{value}</p>
        <span className={`rounded-full px-3 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-white ${accent}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  )
}

export default App

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Nao foi possivel completar a solicitacao.'
}

function isUnauthorized(error: unknown) {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status?: number }).status === 401
  }
  return false
}
