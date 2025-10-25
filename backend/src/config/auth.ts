const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not defined.')
}

export const jwtConfig = {
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
}
