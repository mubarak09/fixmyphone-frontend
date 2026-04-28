/*
  Results.jsx
  -----------
  This page is shown when the user completes all the questions
  in the Q&A flow. It sends the user's answers to the backend
  API which runs the scoring engine and returns the most likely
  cause. The cause and fix steps are displayed with two tabs
  allowing the user to switch between Android and iPhone
  specific fix steps.
*/

import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { diagnose, saveSession } from '../services/api'
import { saveSessionToHistory } from '../services/sessionHistory'
import './Results.css'

function Results() {

  const location = useLocation()
  const navigate = useNavigate()

  const { categoryId, categoryLabel, answers } = location.state || {}

  // Store the top cause returned from the API
  const [topCause, setTopCause] = useState(null)

  // Store the saved session id
  const [sessionId, setSessionId] = useState(null)

  // Track which tab is selected - "android" or "ios"
  const [activeTab, setActiveTab] = useState('android')

  // Track loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Prevent double save in React Strict Mode
  const hasRun = useRef(false)

  useEffect(() => {

    if (hasRun.current) return
    hasRun.current = true

    const runDiagnosis = async () => {
      try {
        setLoading(true)

        // Run the scoring engine to get the top cause
        const result = await diagnose(categoryId, answers)
        setTopCause(result)

        // Automatically save the session to MongoDB
        const savedSession = await saveSession({
          categoryId,
          categoryLabel,
          causeTitle: result.title,
          causeDescription: result.description,
          answers,
          fixSteps: result.fixSteps,
          iosFixSteps: result.iosFixSteps
        })

        setSessionId(savedSession._id)

        // Save to localStorage history
        saveSessionToHistory(savedSession._id, categoryLabel, result.title)

        setLoading(false)
      } catch (err) {
        setError('Could not run diagnosis. Please check your connection and try again.')
        setLoading(false)
      }
    }

    if (categoryId && answers) {
      runDiagnosis()
    } else {
      setError('Missing data. Please start again.')
      setLoading(false)
    }

  }, [categoryId, answers])

  const handleGoHome = () => navigate('/')
  const handleTryAgain = () => navigate(`/qa/${categoryId}`)
  const handleViewSummary = () => navigate(`/summary/${sessionId}`)

  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <p>Analysing your answers — please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="results-error">
          <p>{error}</p>
          <button className="results-home-button" onClick={handleGoHome}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!topCause) {
    return (
      <div className="results-container">
        <div className="results-no-result">
          <h2>We could not determine a specific cause</h2>
          <p>
            Your issue may need further investigation. Please contact
            your device manufacturer or network provider for support.
          </p>
          <button className="results-home-button" onClick={handleGoHome}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Get the fix steps for the active tab
  const activeFixSteps = activeTab === 'android'
    ? topCause.fixSteps
    : topCause.iosFixSteps

  return (
    <div className="results-container">

      {/* Header */}
      <div className="results-header">
        <button className="results-back-button" onClick={handleGoHome}>
          ← Back
        </button>
        <span className="results-category-label">{categoryLabel}</span>
      </div>

      {/* Diagnosis card */}
      <div className="results-diagnosis-card">
        <p className="results-diagnosis-label">Most likely cause</p>
        <h2 className="results-cause-title">{topCause.title}</h2>
        <p className="results-cause-description">{topCause.description}</p>
      </div>

      {/* Fix plan heading */}
      <h3 className="results-fix-heading">Your fix plan</h3>

      {/* iOS / Android tab selector */}
      <div className="results-tab-selector">
        <button
          className={`results-tab-button ${activeTab === 'android' ? 'active' : ''}`}
          onClick={() => setActiveTab('android')}
        >
          Android
        </button>
        <button
          className={`results-tab-button ${activeTab === 'ios' ? 'active' : ''}`}
          onClick={() => setActiveTab('ios')}
        >
          iPhone
        </button>
      </div>

      {/* Fix steps for selected tab */}
      <div className="results-fix-steps">
        {activeFixSteps && activeFixSteps.map((fixStep) => (
          <div key={fixStep.step} className="results-fix-step">
            <div className="results-step-number">{fixStep.step}</div>
            <div>
              <p className="results-step-title">{fixStep.title}</p>
              <p className="results-step-detail">{fixStep.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Escalation summary button */}
      {sessionId && (
        <div className="results-summary-section">
          <p className="results-summary-hint">
            Still not resolved? View your escalation summary to share
            with a support agent.
          </p>
          <button
            className="results-summary-button"
            onClick={handleViewSummary}
          >
            View Escalation Summary
          </button>
        </div>
      )}

      {/* Action buttons */}
      <button className="results-home-button" onClick={handleGoHome}>
        Back to Home
      </button>

      <button className="results-restart-button" onClick={handleTryAgain}>
        Start again
      </button>

    </div>
  )
}

export default Results