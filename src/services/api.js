/*
  api.js
  ------
  This file handles all communication between the
  React frontend and the Express backend API.

  All fetch calls to the backend go through here.
  A timeout is set on each request to handle the
  Render free tier spin-up delay gracefully.
*/

// Base URL for all API calls
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Timeout duration in milliseconds
// Set to 60 seconds to handle Render free tier spin-up delay
const TIMEOUT_MS = 60000

/*
  fetchWithTimeout
  ----------------
  A wrapper around fetch that adds a timeout.
  If the request takes longer than TIMEOUT_MS it
  throws an error with a helpful message.

  Parameters:
    url     - the URL to fetch
    options - standard fetch options object
*/
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be waking up — please try again.')
    }
    throw error
  }
}

/*
  getIssues
  ---------
  Fetches all issue categories from the backend.
  Used on the Home page to load the category cards.
*/
export const getIssues = async () => {
  const response = await fetchWithTimeout(`${BASE_URL}/api/issues`)
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
  const response = await fetchWithTimeout(`${BASE_URL}/api/questions/${issueId}`)
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
  const response = await fetchWithTimeout(`${BASE_URL}/api/diagnose`, {
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
    context - object containing locationType, issueFrequency,
              networkMode and simStatus
*/
export const getSignalScenario = async (context) => {
  const response = await fetchWithTimeout(`${BASE_URL}/api/signal`, {
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
*/
export const saveSession = async (sessionData) => {
  const response = await fetchWithTimeout(`${BASE_URL}/api/sessions`, {
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
*/
export const saveSignalSession = async (sessionData) => {
  const response = await fetchWithTimeout(`${BASE_URL}/api/sessions`, {
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