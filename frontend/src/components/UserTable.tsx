import { roleLabels, type User } from '../types/user'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onToggleActive: (user: User) => void
  loading?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function UserTable({ users, onEdit, onDelete, onToggleActive, loading = false }: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 shadow-soft backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left">
          <thead>
            <tr className="bg-slate-900/80 text-xs uppercase tracking-[0.18em] text-slate-400">
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Perfil</th>
              <th className="px-6 py-4 font-medium">Criado em</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm text-slate-200">
            {loading && (
              <tr>
                <td className="px-6 py-10 text-center text-slate-400" colSpan={6}>
                  Carregando usuarios...
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-primary/5"
                >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-lg font-semibold text-primary-200 shadow-inner shadow-primary/30">
                      {user.nome
                        .split(' ')
                        .slice(0, 2)
                        .map((word) => word.charAt(0).toUpperCase())
                        .join('')}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.nome}</p>
                      <p className="text-xs text-slate-400">#{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-200">
                    <span className="h-2 w-2 rounded-full bg-primary-400" />
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {dateFormatter.format(new Date(user.createdAt))}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleActive(user)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      user.ativo
                        ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
                    }`}
                    type="button"
                  >
                    <span className={`h-2 w-2 rounded-full ${user.ativo ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="rounded-full bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
                      type="button"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!loading && users.length === 0 && (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center text-slate-400">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
            ?
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Nenhum usuario encontrado</p>
            <p className="text-sm text-slate-400">
              Ajuste os filtros ou cadastre um novo colaborador para iniciar o monitoramento.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
