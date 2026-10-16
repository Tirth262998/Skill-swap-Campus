import { apiCall } from './api'

export const getDiscoverStudents = (params = {}) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }

  const suffix = query.size ? `?${query.toString()}` : ''
  return apiCall(`/discover/students${suffix}`, { method: 'GET' })
}

export const getStudent = (userId) =>
  apiCall(`/discover/students/${encodeURIComponent(userId)}`, { method: 'GET' })

export const sendExchangeRequest = (payload) =>
  apiCall('/discover/exchange-requests', {
    method: 'POST',
    body: payload,
  })
