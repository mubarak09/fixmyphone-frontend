/*
  sessionHistory.js
  -----------------
  This file manages the user's session history using
  localStorage. localStorage is built into every browser
  and stores data privately on the user's device.

  Each user only sees their own sessions on their own
  device. No session data from other users is ever shown.

  Functions:
  - saveSessionToHistory: saves a session id and summary
  - getSessionHistory: returns all saved sessions
  - clearSessionHistory: removes all saved sessions
*/

// The key we use to store session history in localStorage
const STORAGE_KEY = 'fixmyphone_session_history'

// Maximum number of sessions to keep in history
const MAX_SESSIONS = 10

/*
  saveSessionToHistory
  --------------------
  Saves a completed session to the browser's localStorage.
  Keeps only the most recent MAX_SESSIONS sessions.

  Parameters:
    sessionId     - the MongoDB id of the saved session
    categoryLabel - e.g. "Mobile Signal"
    causeTitle    - e.g. "Possible network outage in your area"
*/
export const saveSessionToHistory = (sessionId, categoryLabel, causeTitle) => {
  try {
    // Get the existing history or start with an empty array
    const existingHistory = getSessionHistory()

    // Create a new history entry
    const newEntry = {
      sessionId,
      categoryLabel,
      causeTitle,
      date: new Date().toISOString()
    }

    // Add the new entry to the start of the array
    const updatedHistory = [newEntry, ...existingHistory]

    // Keep only the most recent MAX_SESSIONS entries
    const trimmedHistory = updatedHistory.slice(0, MAX_SESSIONS)

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory))

  } catch (error) {
    console.log('Error saving session to history:', error)
  }
}

/*
  getSessionHistory
  -----------------
  Returns all saved sessions from localStorage as an array.
  Returns an empty array if nothing is saved yet.
*/
export const getSessionHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.log('Error reading session history:', error)
    return []
  }
}

/*
  clearSessionHistory
  -------------------
  Removes all saved sessions from localStorage.
*/
export const clearSessionHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.log('Error clearing session history:', error)
  }
}