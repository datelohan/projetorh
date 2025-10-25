export function toPublicUser<T extends { senhaHash?: string | null }>(user: T): Omit<T, 'senhaHash'> {
  const { senhaHash, ...rest } = user
  return rest
}
