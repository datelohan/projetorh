const TOKEN_KEY = 'projetorh:token'

let inMemoryToken: string | null = null

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getStoredToken() {
  if (inMemoryToken) {
    return inMemoryToken
  }

  if (!hasWindow()) {
    return null
  }

  const token = window.localStorage.getItem(TOKEN_KEY)
  inMemoryToken = token
  return token
}

export function setStoredToken(token: string | null) {
  inMemoryToken = token

  if (!hasWindow()) {
    return
  }

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}
