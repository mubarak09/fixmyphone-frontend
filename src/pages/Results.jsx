/*
  Results.jsx
  -----------
  This page is shown when the user completes all the questions
  in the Q&A flow. It sends the user's answers to the backend
  API which runs the scoring engine and returns the most likely
  cause. The cause title, description and fix steps are then
  displayed to the user.
*/

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { diagnose } from '../services/api'
import './Results.css'

function Results() {

  // useLocation lets us read the answers data passed from QAFlow
  const location = useLocation()
  const navigate = useNavigate()

  // Get the data that was passed when navigating here
  const { categoryId, categoryLabel, answers } = location.state || {}

  // Store the top cause returned from the API
  const [topCause, setTopCause] = useState(null)

  // Track whether the diagnosis is still loading
  const [loading, setLoading] = useState(true)

  // Track any error that occurs during the API call
  const [error, setError] = useState(null)

  // Call the diagnose API when the component loads
  useEffect(() => {

    const runDiagnosis = async () => {
      try {
        setLoading(true)
        const result = await diagnose(categoryId, answers)
        setTopCause(result)
        setLoading(false)
      } catch (err) {
        setError('Could not run diagnosis. Please check your connection and try again.')
        setLoading(false)
      }
    }

    // Only run if we have the required data
    if (categoryId && answers) {
      runDiagnosis()
    } else {
      setError('Missing data. Please start again.')
      setLoading(false)
    }

  }, [categoryId, answers])

  // Handle the back to home button click
  const handleGoHome = () => {
    navigate('/')
  }

  // Handle the try again button - restart the same category
  const handleTryAgain = () => {
    navigate(`/qa/${categoryId}`)
  }

  // Show a loading message while the diagnosis is running
  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <p>Analysing your answers...</p>
        </div>
      </div>
    )
  }

  // Show an error message if something went wrong
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

  // Show a fallback if no cause was returned
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

  return (
    <div className="results-container">

      {/* Header with back button and category name */}
      <div className="results-header">
        <button className="results-back-button" onClick={handleGoHome}>
          ← Back
        </button>
        <span className="results-category-label">{categoryLabel}</span>
      </div>

      {/* Diagnosis card showing the most likely cause */}
      <div className="results-diagnosis-card">
        <p className="results-diagnosis-label">Most likely cause</p>
        <h2 className="results-cause-title">{topCause.title}</h2>
        <p className="results-cause-description">{topCause.description}</p>
      </div>

      {/* Fix plan heading */}
      <h3 className="results-fix-heading">Your fix plan</h3>

      {/* List of fix steps */}
      <div className="results-fix-steps">
        {topCause.fixSteps.map((fixStep) => (
          <div key={fixStep.step} className="results-fix-step">

            {/* Step number circle */}
            <div className="results-step-number">{fixStep.step}</div>

            {/* Step content */}
            <div>
              <p className="results-step-title">{fixStep.title}</p>
              <p className="results-step-detail">{fixStep.detail}</p>
            </div>

          </div>
        ))}
      </div>

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