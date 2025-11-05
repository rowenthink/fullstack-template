const API_URL = import.meta.env.VITE_API_BASE_URL  || 'http://localhost:5000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || response.statusText)
  }
  return response.json()
}

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`)
    return handleResponse<T>(response)
  },

  post: async <T>(path: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse<T>(response)
  },

  put: async <T>(path: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse<T>(response)
  },

  delete: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE'
    })
    return handleResponse<T>(response)
  }
}