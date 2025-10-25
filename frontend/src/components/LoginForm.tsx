import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

interface LoginFormProps {
  mode: 'login' | 'register'
  loading?: boolean
  errorMessage?: string | null
  onLogin: (payload: { email: string; senha: string }) => void
  onRegister: (payload: { nome: string; email: string; senha: string }) => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

export function LoginForm({
  mode,
  loading = false,
  errorMessage,
  onLogin,
  onRegister,
  onSwitchMode,
}: LoginFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const isRegister = mode === 'register'

  useEffect(() => {
    setLocalError(null)
    setSenha('')
    setConfirmacaoSenha('')
    if (mode === 'register') {
      setNome('')
    }
  }, [mode])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLocalError(null)

    if (isRegister) {
      if (!nome.trim()) {
        setLocalError('Informe seu nome completo.')
        return
      }

      if (senha.trim().length < 6) {
        setLocalError('Utilize ao menos 6 caracteres na senha.')
        return
      }

      if (senha !== confirmacaoSenha) {
        setLocalError('As senhas precisam ser iguais.')
        return
      }

      onRegister({ nome: nome.trim(), email: email.trim(), senha })
      return
    }

    onLogin({ email: email.trim(), senha })
  }

  const heading = isRegister ? 'Crie sua conta' : 'Acesse o painel'
  const description = isRegister
    ? 'Preencha os dados para liberar o acesso ao portal do Projeto RH.'
    : 'Utilize suas credenciais corporativas para gerenciar colaboradores e fluxos internos.'

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-soft backdrop-blur">
      <div className="mb-8 space-y-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-200/80">
          Projeto RH
        </span>
        <h1 className="text-3xl font-semibold text-white">{heading}</h1>
        <p className="text-sm text-slate-400">
          {description}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Nome completo</label>
            <input
              type="text"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Seu nome"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400"
              required
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Senha</label>
          <input
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400"
            required
          />
        </div>

        {isRegister && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Confirmar senha</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmacaoSenha}
              onChange={(event) => setConfirmacaoSenha(event.target.value)}
              placeholder="Repita sua senha"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white outline-none transition focus:border-primary-400"
              required
            />
          </div>
        )}

        {(errorMessage || localError) && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm text-rose-200">
            {localError ?? errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-soft transition ${
            loading ? 'cursor-not-allowed bg-primary-500/60' : 'bg-primary-500 hover:bg-primary-400'
          }`}
        >
          {loading ? (isRegister ? 'Criando conta...' : 'Entrando...') : isRegister ? 'Criar conta' : 'Entrar no painel'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        {isRegister ? 'Ja possui uma conta?' : 'Ainda nao possui acesso?'}{' '}
        <button
          type="button"
          className="font-semibold uppercase tracking-[0.2em] text-primary-300 transition hover:text-primary-200"
          onClick={() => onSwitchMode(isRegister ? 'login' : 'register')}
        >
          {isRegister ? 'Entrar' : 'Criar conta'}
        </button>
      </div>
    </div>
  )
}
