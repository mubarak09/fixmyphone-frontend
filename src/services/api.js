/*
  api.js
  ------
  This file handles all communication between the
  React frontend and the Express backend API.

  All fetch calls to the backend go through here.
  The base URL reads from an environment variable so
  it works both in development and in production.
*/

// Base URL for all API calls
// In development this will be http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/*
  getIssues
  ---------
  Fetches all issue categories from the backend.
  Used on the Home page to load the category cards.
*/
export const getIssues = async () => {
  const response = await fetch(`${BASE_URL}/api/issues`)
  if (!response.ok) {
    throw new Error('Failed to fetch issues')
  }
  return response.json()
}

/*
  getQuestions
  ------------
  Fetches all questions for a specific issue category.
  Used in the QAFlow page when a category is selected.

  Parameters:
    issueId - string e.g. "signal" or "wifi"
*/
export const getQuestions = async (issueId) => {
  const response = await fetch(`${BASE_URL}/api/questions/${issueId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch questions')
  }
  return response.json()
}

/*
  diagnose
  --------
  Sends the user's answers to the backend scoring engine
  and returns the most likely cause with its fix steps.

  Parameters:
    categoryId - string e.g. "signal"
    answers    - array of { questionId, answerId } objects
*/
export const diagnose = async (categoryId, answers) => {
  const response = await fetch(`${BASE_URL}/api/diagnose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ categoryId, answers })
  })
  if (!response.ok) {
    throw new Error('Failed to run diagnosis')
  }
  return response.json()
}

/*
  getSignalScenario
  -----------------
  Sends the user's connectivity context to the backend
  and returns the best matching simulated signal scenario.

  Parameters:
    context - object containing:
      locationType    - "indoors" or "outdoors"
      issueFrequency  - "everywhere", "one-location" or "intermittent"
      networkMode     - "4g", "3g", "5g" or "unsure"
      simStatus       - "active" or "inactive"
*/
export const getSignalScenario = async (context) => {
  const response = await fetch(`${BASE_URL}/api/signal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(context)
  })
  if (!response.ok) {
    throw new Error('Failed to get signal scenario')
  }
  return response.json()
}

/*
  saveSession
  -----------
  Saves a completed troubleshooting session to the backend.
  Called automatically when the user reaches the Results page.

  Parameters:
    sessionData - object containing categoryId, categoryLabel,
                  causeTitle, causeDescription, answers, fixSteps
*/
export const saveSession = async (sessionData) => {
  const response = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  })
  if (!response.ok) {
    throw new Error('Failed to save session')
  }
  return response.json()
}

/*
  saveSignalSession
  -----------------
  Saves a completed Signal Troubleshooter session to the backend.
  Called automatically when the user reaches the signal results screen.

  Parameters:
    sessionData - object containing categoryId, categoryLabel,
                  causeTitle, causeDescription, answers, fixSteps
*/
export const saveSignalSession = async (sessionData) => {
  const response = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  })
  if (!response.ok) {
    throw new Error('Failed to save signal session')
  }
  return response.json()
}