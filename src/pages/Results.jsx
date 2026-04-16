/*
  Results.jsx
  -----------
  This page is shown when the user completes all the questions
  in the Q&A flow. It runs the scoring engine against their
  answers to determine the most likely cause of their problem
  and then displays a step by step fix plan for that cause.
*/

import { useLocation, useNavigate } from 'react-router-dom'
import runScoringEngine from '../services/scoringEngine'
import './Results.css'

function Results() {

  // useLocation lets us read the answers data passed from QAFlow
  const location = useLocation()
  const navigate = useNavigate()

  // Get the data that was passed when navigating here
  const { categoryId, categoryLabel, answers } = location.state || {}

  // Run the scoring engine to find the most likely cause
  const topCause = runScoringEngine(categoryId, answers)

  // Handle the back to home button click
  const handleGoHome = () => {
    navigate('/')
  }

  // Handle the try again button - restart the same category
  const handleTryAgain = () => {
    navigate(`/qa/${categoryId}`)
  }

  // If no cause was found show a fallback message
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