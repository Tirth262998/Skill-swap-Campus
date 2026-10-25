import { apiCall } from './api'

export const getRequests = () => apiCall('/requests', { method: 'GET' })

export const updateRequestStatus = (requestId, status) => {
  const normalizedStatus = status === 'accepted' ? 'accept' : 'reject'
  return apiCall(`/requests/${requestId}/${normalizedStatus}`, { method: 'POST' })
}
