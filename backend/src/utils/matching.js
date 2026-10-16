const normalizeText = (value) =>
    typeof value === "string" ? value.trim().replace(/\s+/g, " ").toLowerCase() : "";

const getSkillSet = (skills, type) =>
    new Set(
        (Array.isArray(skills) ? skills : [])
            .filter((skill) => skill && skill.type === type)
            .map((skill) => normalizeText(skill.name))
            .filter(Boolean)
    );

const overlapCount = (left, right) => {
    let count = 0;
    for (const skill of left) {
        if (right.has(skill)) count += 1;
    }
    return count;
};

const calculateMatchScore = (currentStudent, candidate) => {
    const currentProfile = currentStudent?.profile || {};
    const candidateProfile = candidate?.profile || {};
    const currentTeaches = getSkillSet(currentStudent?.skills, "teach");
    const currentLearns = getSkillSet(currentStudent?.skills, "learn");
    const candidateTeaches = getSkillSet(candidate?.skills, "teach");
    const candidateLearns = getSkillSet(candidate?.skills, "learn");

    const skillExchangeRatio = currentLearns.size
        ? overlapCount(currentLearns, candidateTeaches) / currentLearns.size
        : 0;
    const reverseSkillRatio = candidateLearns.size
        ? overlapCount(candidateLearns, currentTeaches) / candidateLearns.size
        : 0;

    const currentAvailability = normalizeText(currentProfile.availability);
    const candidateAvailability = normalizeText(candidateProfile.availability);
    const availabilityRatio =
        currentAvailability && candidateAvailability && currentAvailability === candidateAvailability
            ? 1
            : 0;

    const score =
        skillExchangeRatio * 45 +
        reverseSkillRatio * 45 +
        availabilityRatio * 10;

    return Math.max(0, Math.min(100, score));
};

module.exports = { calculateMatchScore, normalizeText };
