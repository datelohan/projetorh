import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Role, User } from '../types/user'

interface UserFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: UserFormValues) => Promise<void> | void
  initialData?: User | null
  submitting?: boolean
  errorMessage?: string | null
}

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'ADMIN', label: 'Administrador', description: 'Acesso completo a configuracoes e auditorias.' },
  { value: 'RH', label: 'RH', description: 'Gerencia colaboradores, ferias e processos seletivos.' },
  { value: 'GESTOR', label: 'Gestor', description: 'Acompanha performance da equipe e aprova solicitacoes.' },
  { value: 'FUNCIONARIO', label: 'Funcionario', description: 'Acessa holerites, ponto e registro pessoal.' },
]

export interface UserFormValues {
  id?: string
  nome: string
  email: string
  role: Role
  ativo: boolean
  senha: string
}

const defaultValues: UserFormValues = {
  nome: '',
  email: '',
  role: 'FUNCIONARIO',
  ativo: true,
  senha: '',
}

export function UserForm({ open, onClose, onSubmit, initialData, submitting = false, errorMessage }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (initialData) {
        setValues({
          id: initialData.id,
          nome: initialData.nome,
          email: initialData.email,
          role: initialData.role,
          ativo: initialData.ativo,
          senha: '',
        })
      } else {
        setValues(defaultValues)
      }
      setErrors({})
    }
  }, [open, initialData])

  const mode = useMemo(() => (initialData ? 'edit' : 'create'), [initialData])

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = event.target
    const normalizedValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value
    setValues((prev) => ({
      ...prev,
      [name]: normalizedValue,
    }))
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (!values.nome.trim()) {
      nextErrors.nome = 'Informe o nome completo.'
    }
    if (!values.email.trim()) {
      nextErrors.email = 'Informe o email corporativo.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Email invalido.'
    }
    if (mode === 'create') {
      if (!values.senha.trim()) {
        nextErrors.senha = 'Defina uma senha provisoria.'
      } else if (values.senha.trim().length < 6) {
        nextErrors.senha = 'Utilize ao menos 6 caracteres.'
      }
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (!validate()) return
    const payload = { ...values, senha: values.senha.trim() }
    onSubmit(payload)
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-xl transform bg-slate-900/95 shadow-2xl backdrop-blur transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-10 py-12">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary-300">{mode === 'edit' ? 'Editar usuario' : 'Novo usuario'}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{mode === 'edit' ? 'Atualizar colaborador' : 'Cadastrar colaborador'}</h2>
              <p className="mt-3 text-sm text-slate-400">
                Defina o nivel de acesso, status e dados basicos para habilitar o uso da plataforma.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/10"
              type="button"
            >
              Fechar
            </button>
          </div>

          <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Nome completo</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400 focus:bg-slate-900/60"
                  placeholder="Ex: Ana Maria Santos"
                  name="nome"
                  value={values.nome}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.nome && <p className="mt-2 text-xs text-rose-300">{errors.nome}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Email corporativo</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400 focus:bg-slate-900/60"
                  placeholder="nome.sobrenome@empresa.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="off"
                />
                {errors.email && <p className="mt-2 text-xs text-rose-300">{errors.email}</p>}
              </div>

              {mode === 'create' && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Senha provisoria</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400 focus:bg-slate-900/60"
                    placeholder="Defina uma senha inicial"
                    name="senha"
                    value={values.senha}
                    onChange={handleChange}
                    type="password"
                    autoComplete="new-password"
                  />
                  {errors.senha && <p className="mt-2 text-xs text-rose-300">{errors.senha}</p>}
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">A senha pode ser alterada posteriormente pelo usuario.</p>
                </div>
              )}
            </div>

            <fieldset className="space-y-4">
              <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Perfil de acesso</legend>
              <div className="grid gap-4">
                {roles.map((role) => {
                  const selected = values.role === role.value
                  return (
                    <label
                      key={role.value}
                      className={`flex cursor-pointer flex-col gap-2 rounded-3xl border px-5 py-4 transition ${
                        selected
                          ? 'border-primary-400/80 bg-primary/10 text-white shadow-soft'
                          : 'border-white/5 bg-white/5 text-slate-300 hover:border-primary-400/30 hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase tracking-[0.25em]">{role.label}</span>
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selected}
                          onChange={handleChange}
                          className="h-4 w-4 cursor-pointer accent-primary-400"
                        />
                      </div>
                      <span className="text-xs text-slate-400">{role.description}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/5 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Usuario ativo</p>
                <p className="text-xs text-slate-400">Controla o acesso ao portal e notificacoes.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={values.ativo}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-primary-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-white/30 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-soft transition ${
                  submitting
                    ? 'cursor-not-allowed bg-primary-500/60'
                    : 'bg-primary-500 hover:bg-primary-400'
                }`}
              >
                {submitting ? 'Salvando...' : mode === 'edit' ? 'Salvar alteracoes' : 'Criar usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
