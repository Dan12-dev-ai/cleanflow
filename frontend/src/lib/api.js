export const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function api(path, options = {}) {
  const token = localStorage.getItem('cleanflow_token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || 'The request could not be completed.')
  return body
}

export const apiData = (path, options) => api(path, options).then((result) => result.data ?? result)
