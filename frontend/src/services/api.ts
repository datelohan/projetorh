import { getStoredToken } from './tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

type RequestOptions = RequestInit & {
  parseJson?: boolean
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { parseJson = true, auth = true, ...requestOptions } = options

  const headers = new Headers(requestOptions.headers)
  const hasBody = requestOptions.body !== undefined && requestOptions.body !== null

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getStoredToken()
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`
    try {
      const body = await response.json()
      if (body && typeof body.message === 'string') {
        errorMessage = body.message
      }
    } catch {
      // ignore parse errors
    }
    const error = new Error(errorMessage) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  if (!parseJson || response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
