/**
 * API Helper for making authenticated requests to the backend
 * Base URL: NEXT_PUBLIC_API_URL or localhost:8000
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { requireAuth = true, headers = {}, ...restOptions } = options
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers as Record<string, string>,
  }

  // Add authorization token if required
  if (requireAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  })

  // Handle different response types
  if (response.status === 204) {
    return null // No content
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    
    // Handle specific error codes
    if (response.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('Session expired. Please login again.')
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.')
    }
    
    if (response.status === 422) {
      // Validation error
      const detail = errorData?.detail
      if (Array.isArray(detail)) {
        const messages = detail.map((d: any) => d.msg).join(', ')
        throw new Error(`Validation error: ${messages}`)
      }
      throw new Error(detail || 'Invalid request data')
    }
    
    throw new Error(errorData?.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

// Convenience methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data: any) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint: string, data: any) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  patch: (endpoint: string, data: any) => apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint: string) => apiCall(endpoint, {
    method: 'DELETE',
  }),
}

export { API_URL }
