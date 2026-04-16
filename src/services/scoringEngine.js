/*
  scoringEngine.js
  ----------------
  This file contains the logic that analyses the user's answers
  and works out the most likely cause of their phone problem.

  How it works:
  1. It receives the user's answers and the category they selected
  2. It loads the rules for that category from rules.json
  3. For each rule it checks if the user gave the matching answer
  4. If they did it adds the rule's score to that cause's total
  5. It returns the cause with the highest total score
*/

import rulesData from '../data/rules.json'
import causesData from '../data/causes.json'

/*
  runScoringEngine
  ----------------
  Takes the category id and the array of answers the user gave
  and returns the top cause with its fix steps.

  Parameters:
    categoryId - string e.g. "signal" or "wifi"
    answers    - array of { questionId, answerId } objects

  Returns:
    The cause object with the highest score, including its fix steps
*/
const runScoringEngine = (categoryId, answers) => {

  // Get the rules for this category
  const rules = rulesData[categoryId]

  // If no rules exist for this category return null
  if (!rules) return null

  // Create an empty scores object to track points for each cause
  // It will look like: { "network-outage": 5, "sim-issue": 2 }
  const scores = {}

  // Loop through every rule for this category
  rules.forEach((rule) => {

    // Check if the user gave the answer this rule is looking for
    const matchingAnswer = answers.find(
      (answer) =>
        answer.questionId === rule.questionId &&
        answer.answerId === rule.answerId
    )

    // If the user's answer matches this rule, add the score to that cause
    if (matchingAnswer) {
      if (scores[rule.causeId]) {
        // Cause already has some points so add to the existing total
        scores[rule.causeId] += rule.score
      } else {
        // First time this cause has been scored so start it at this score
        scores[rule.causeId] = rule.score
      }
    }
  })

  // Find the cause with the highest score
  // Object.entries turns { "network-outage": 5 } into [["network-outage", 5]]
  const sortedCauses = Object.entries(scores).sort((a, b) => b[1] - a[1])

  // If no causes were scored return null
  if (sortedCauses.length === 0) return null

  // Get the top cause id (first item after sorting)
  const topCauseId = sortedCauses[0][0]

  // Look up the full cause details from causes.json and return it
  return causesData[topCauseId] || null
}

export default runScoringEngine