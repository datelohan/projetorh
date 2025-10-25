import bcrypt from 'bcryptjs'

const HASH_ROUNDS = 10

export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, HASH_ROUNDS)
}

export function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword)
}
