const normalizeText = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLowerCase() : ''

const normalizeId = (value) => (value == null ? '' : String(value))

export function rankStudents(_currentStudent, candidates) {
  const uniqueCandidates = new Map()

  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    const profile = candidate?.profile
    const candidateId = normalizeId(profile?.userId || profile?.id)
    const score = Number(candidate?.matchScore)
    if (!candidateId || !profile?.name || !Number.isFinite(score)) continue
    if (!uniqueCandidates.has(candidateId)) {
      uniqueCandidates.set(candidateId, {
        ...candidate,
        matchScore: Math.max(0, Math.min(100, score)),
      })
    }
  }

  return [...uniqueCandidates.values()]
}

export function filterStudents(students, filters = {}) {
  const skillQuery = normalizeText(filters.skill)
  const department = normalizeText(filters.department)
  const availability = normalizeText(filters.availability)
  const minimumScore = Number.isFinite(Number(filters.minimumScore))
    ? Number(filters.minimumScore)
    : 0

  return (Array.isArray(students) ? students : []).filter((student) => {
    const profile = student.profile || {}
    const skills = Array.isArray(student.skills) ? student.skills : []

    if (department && normalizeText(profile.department) !== department) return false
    if (availability && normalizeText(profile.availability) !== availability) return false
    if (Number(student.matchScore) < minimumScore) return false

    if (skillQuery) {
      const candidateSkillType =
        filters.skillType === 'learn' ? 'teach' : filters.skillType === 'teach' ? 'learn' : ''
      const hasSkill = skills.some(
        (skill) =>
          (!candidateSkillType || skill?.type === candidateSkillType) &&
          normalizeText(skill?.name).includes(skillQuery)
      )
      if (!hasSkill) return false
    }

    return true
  })
}

export function getStudentId(student) {
  return normalizeId(student?.profile?.userId || student?.profile?.id)
}
