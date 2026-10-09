import { apiCall } from './api'

export const getMySkills = () =>
  apiCall('/skills', { method: 'GET' })

export const createSkill = (skillData) =>
  apiCall('/skills', {
    method: 'POST',
    body: skillData,
  })

export const updateSkill = (skillId, skillData) =>
  apiCall(`/skills/${skillId}`, {
    method: 'PUT',
    body: skillData,
  })

export const deleteSkill = (skillId) =>
  apiCall(`/skills/${skillId}`, {
    method: 'DELETE',
  })
