const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateMatchScore } = require("../src/utils/matching");

const makeStudent = ({ department, availability, interests, skills = [] } = {}) => ({
    profile: { department, availability, interests },
    skills,
});

test("fully reciprocal skills and matching availability score 100", () => {
    const current = makeStudent({
        availability: "Weekends",
        skills: [
            { name: "Java", type: "teach" },
            { name: "Python", type: "learn" },
        ],
    });
    const candidate = makeStudent({
        availability: " weekends ",
        skills: [
            { name: "Python", type: "teach" },
            { name: "Java", type: "learn" },
        ],
    });

    assert.equal(calculateMatchScore(current, candidate), 100);
});

test("one-way skill exchange awards only the matching 45 percent component", () => {
    const current = makeStudent({
        skills: [{ name: "Python", type: "learn" }],
    });
    const candidate = makeStudent({
        skills: [{ name: " python ", type: "teach" }],
    });

    assert.equal(calculateMatchScore(current, candidate), 45);
});

test("reverse compatibility awards 45 percent when the current student can teach a candidate learning goal", () => {
      const current = makeStudent({
          skills: [{ name: "Java", type: "teach" }],
      });
      const candidate = makeStudent({
          skills: [{ name: " java ", type: "learn" }],
      });

      assert.equal(calculateMatchScore(current, candidate), 45);
});

test("partial distinct-skill overlap is a ratio and duplicate skills do not inflate it", () => {
    const current = makeStudent({
        skills: [
            { name: "Python", type: "learn" },
            { name: "SQL", type: "learn" },
            { name: "python", type: "learn" },
        ],
    });
    const candidate = makeStudent({
        skills: [
            { name: "python", type: "teach" },
            { name: "Python ", type: "teach" },
        ],
    });

    assert.equal(calculateMatchScore(current, candidate), 22.5);
});

test("availability contributes ten points only for equal non-empty normalized labels", () => {
    const current = makeStudent({ availability: "Evenings" });
    const compatible = makeStudent({ availability: " evenings " });
    const incompatible = makeStudent({ availability: "Weekends" });
    const unavailable = makeStudent();

    assert.equal(calculateMatchScore(current, compatible), 10);
    assert.equal(calculateMatchScore(current, incompatible), 0);
    assert.equal(calculateMatchScore(current, unavailable), 0);
});

test("department and interests do not affect the score and missing skill directions earn no points", () => {
    const current = makeStudent({
        department: "CSE",
        interests: ["music"],
        skills: [{ name: "Java", type: "teach" }],
    });
    const candidate = makeStudent({
        department: "ECE",
        interests: ["music"],
        skills: [{ name: "Java", type: "learn" }],
    });
    const sameDepartmentAndInterests = makeStudent({
        department: "CSE",
        interests: ["music"],
        skills: [{ name: "Java", type: "learn" }],
    });

    assert.equal(calculateMatchScore(current, candidate), 45);
    assert.equal(calculateMatchScore(current, sameDepartmentAndInterests), 45);
});

test("missing skill and availability fields safely score zero", () => {
    assert.equal(calculateMatchScore({ profile: {} }, { profile: {} }), 0);
});
