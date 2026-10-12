const normalizeText = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLocaleLowerCase() : ''

const normalizeId = (value) => (value == null ? '' : String(value))

const skillSet = (skills, type) =>
  new Set(
    (Array.isArray(skills) ? skills : [])
      .filter((skill) => skill?.type === type)
      .map((skill) => normalizeText(skill.name))
      .filter(Boolean)
  )

const intersects = (left, right) => {
  for (const value of left) {
    if (right.has(value)) return true
  }
  return false
}

const overlapCount = (left, right) => {
  let count = 0
  for (const value of left) {
    if (right.has(value)) count += 1
  }
  return count
}

export function calculateMatchScore(currentStudent, candidate) {
  const currentProfile = currentStudent?.profile || {}
  const candidateProfile = candidate?.profile || {}
  const currentSkills = Array.isArray(currentStudent?.skills) ? currentStudent.skills : []
  const candidateSkills = Array.isArray(candidate?.skills) ? candidate.skills : []

  const currentTeaches = skillSet(currentSkills, 'teach')
  const currentLearns = skillSet(currentSkills, 'learn')
  const candidateTeaches = skillSet(candidateSkills, 'teach')
  const candidateLearns = skillSet(candidateSkills, 'learn')
  const currentInterests = new Set(
    (Array.isArray(currentProfile.interests) ? currentProfile.interests : [])
      .map(normalizeText)
      .filter(Boolean)
  )
  const candidateInterests = new Set(
    (Array.isArray(candidateProfile.interests) ? candidateProfile.interests : [])
      .map(normalizeText)
      .filter(Boolean)
  )

  let score = 0
  if (intersects(candidateTeaches, currentLearns)) score += 40
  if (intersects(candidateLearns, currentTeaches)) score += 40

  const currentAvailability = normalizeText(currentProfile.availability)
  const candidateAvailability = normalizeText(candidateProfile.availability)
  if (currentAvailability && candidateAvailability && currentAvailability === candidateAvailability) {
    score += 10
  }

  const currentDepartment = normalizeText(currentProfile.department)
  const candidateDepartment = normalizeText(candidateProfile.department)
  if (currentDepartment && candidateDepartment && currentDepartment === candidateDepartment) {
    score += 5
  }

  if (overlapCount(currentInterests, candidateInterests) > 0) score += 5
  return Math.max(0, Math.min(100, score))
}

export function rankStudents(currentStudent, candidates) {
  const currentId = normalizeId(currentStudent?.profile?.userId || currentStudent?.profile?.id)
  const uniqueCandidates = new Map()

  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    const profile = candidate?.profile
    const candidateId = normalizeId(profile?.userId || profile?.id)
    if (!candidateId || candidateId === currentId || !profile?.name) continue
    if (!uniqueCandidates.has(candidateId)) {
      uniqueCandidates.set(candidateId, {
        ...candidate,
        matchScore: calculateMatchScore(currentStudent, candidate),
      })
    }
  }

  return [...uniqueCandidates.values()].sort((left, right) => {
    const scoreDifference = right.matchScore - left.matchScore
    if (scoreDifference !== 0) return scoreDifference

    const nameDifference = normalizeText(left.profile.name).localeCompare(
      normalizeText(right.profile.name)
    )
    if (nameDifference !== 0) return nameDifference
    return normalizeId(left.profile.userId || left.profile.id).localeCompare(
      normalizeId(right.profile.userId || right.profile.id)
    )
  })
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
    if (student.matchScore < minimumScore) return false

    if (skillQuery) {
      const type = filters.skillType === 'learn' ? 'learn' : 'teach'
      if (!skillSet(skills, type).has(skillQuery)) return false
    }

    return true
  })
}

export function getStudentId(student) {
  return normalizeId(student?.profile?.userId || student?.profile?.id)
}
