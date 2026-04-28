/*
  SignalTroubleshooter.jsx
  ------------------------
  This is the dedicated Signal Troubleshooter page.
  It collects four pieces of connectivity context from
  the user through a step by step question flow, sends
  them to the backend API and displays the best matching
  simulated signal scenario with a fix plan.

  This is a separate flow from the main Q&A and focuses
  specifically on mobile network and connectivity issues.
*/

import { useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSignalScenario } from '../services/api'
import { saveSignalSession } from '../services/api'
import { saveSessionToHistory } from '../services/sessionHistory'
import './SignalTroubleshooter.css'

/*
  The four context questions shown to the user.
  These are hardcoded here as they are fixed questions
  that never change unlike the main Q&A flow.
*/
const signalQuestions = [
  {
    id: 'locationType',
    text: 'Where are you when the signal problem happens?',
    options: [
      { id: 'indoors', text: 'Indoors — inside a building' },
      { id: 'outdoors', text: 'Outdoors — outside in the open' },
      { id: 'unsure', text: 'Both indoors and outdoors' }
    ]
  },
  {
    id: 'issueFrequency',
    text: 'How often and where does the problem occur?',
    options: [
      { id: 'everywhere', text: 'Everywhere I go' },
      { id: 'one-location', text: 'Only in one specific location' },
      { id: 'intermittent', text: 'It comes and goes randomly' }
    ]
  },
  {
    id: 'networkMode',
    text: 'What type of signal does your phone show?',
    options: [
      { id: '5g', text: '5G' },
      { id: '4g', text: '4G or LTE' },
      { id: '3g', text: '3G or H+' },
      { id: 'unsure', text: 'I am not sure' }
    ]
  },
  {
    id: 'simStatus',
    text: 'Is your SIM card active and recognised by your phone?',
    options: [
      { id: 'active', text: 'Yes my SIM is active and working' },
      { id: 'inactive', text: 'No it shows as inactive or unrecognised' },
      { id: 'unsure', text: 'I am not sure' }
    ]
  }
]

/*
  getSignalBars
  -------------
  Returns how many bars to show as active based on
  the signal rating returned from the backend.
*/
const getSignalBars = (signalRating) => {
  switch (signalRating) {
    case 'good': return 4
    case 'fair': return 2
    case 'poor': return 1
    case 'no-signal': return 0
    default: return 0
  }
}

/*
  getSignalRatingText
  -------------------
  Returns a human readable label for the signal rating.
*/
const getSignalRatingText = (signalRating) => {
  switch (signalRating) {
    case 'good': return 'Good signal'
    case 'fair': return 'Fair signal'
    case 'poor': return 'Poor signal'
    case 'no-signal': return 'No signal'
    default: return 'Unknown'
  }
}

function SignalTroubleshooter() {

  const navigate = useNavigate()

  // Track which question we are currently on
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Track which option the user has selected for the current question
  const [selectedOption, setSelectedOption] = useState(null)

  // Store all context answers the user has given
  const [context, setContext] = useState({
    locationType: null,
    issueFrequency: null,
    networkMode: null,
    simStatus: null
  })

  // Store the scenario returned from the backend
  const [scenario, setScenario] = useState(null)

  // Track whether we are loading results from the API
  const [loading, setLoading] = useState(false)

  // Track any error from the API call
  const [error, setError] = useState(null)

  // Track whether all questions have been answered
  const [completed, setCompleted] = useState(false)

  // Track which tab is selected - "android" or "ios"
  const [activeTab, setActiveTab] = useState('android')

  // Calculate the progress percentage for the progress bar
  const progressPercentage = (currentQuestionIndex / signalQuestions.length) * 100

  // Get the current question
  const currentQuestion = signalQuestions[currentQuestionIndex]

  // Handle when the user selects an answer option
  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  // This ref prevents the session saving twice in React Strict Mode
  const hasRun = useRef(false)

  // Handle when the user clicks the Next button
  const handleNext = async () => {

    // Update the context with the selected answer
    const updatedContext = {
      ...context,
      [currentQuestion.id]: selectedOption.id
    }

    setContext(updatedContext)

    // If this was the last question send the context to the API
    if (currentQuestionIndex === signalQuestions.length - 1) {
      try {
        setLoading(true)
        const result = await getSignalScenario(updatedContext)
        setScenario(result)
        setCompleted(true)
        setLoading(false)

        // Only save once - prevent double saving in React Strict Mode
        if (!hasRun.current) {
          hasRun.current = true

          // Save signal session to MongoDB
          const savedSession = await saveSignalSession({
            categoryId: 'signal-troubleshooter',
            categoryLabel: 'Signal Troubleshooter',
            causeTitle: result.title,
            causeDescription: result.explanation,
            answers: Object.entries(updatedContext).map(([key, value]) => ({
              questionId: key,
              questionText: key,
              answerId: value,
              answerText: value
            })),
            fixSteps: result.fixSteps
          })

          // Save to localStorage so it appears in Previous Sessions
          saveSessionToHistory(
            savedSession._id,
            'Signal Troubleshooter',
            result.title
          )
        }

        setLoading(false)
      } catch (err) {
        setError('Could not analyse your signal context. Please check your connection and try again.')
        setLoading(false)
      }
      return
    }

    // Otherwise move to the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedOption(null)
  }

  // Handle the back button
  const handleBack = () => {
    navigate('/')
  }

  // Handle start again
  const handleStartAgain = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setContext({
      locationType: null,
      issueFrequency: null,
      networkMode: null,
      simStatus: null
    })
    setScenario(null)
    setCompleted(false)
    setError(null)
    setActiveTab('android')
  }

  // Show loading state while API call is running
  if (loading) {
    return (
      <div className="signal-container">
        <div className="signal-loading">
          <p>Analysing your signal context...</p>
        </div>
      </div>
    )
  }

  // Show error state if the API call failed
  if (error) {
    return (
      <div className="signal-container">
        <div className="signal-error">
          <p>{error}</p>
          <button className="signal-back-button" onClick={handleBack}>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Show results once all questions are answered
  if (completed && scenario) {

    const activeBars = getSignalBars(scenario.signalRating)

    return (
      <div className="signal-container">

        {/* Header */}
        <div className="signal-header">
          <button className="signal-back-button" onClick={handleBack}>
            ← Back
          </button>
          <span className="signal-header-label">Signal Troubleshooter</span>
        </div>

        {/* Signal rating card with visual bars */}
        <div className="signal-rating-card">
          <p className="signal-rating-label">Simulated signal assessment</p>

          {/* Signal bars visual */}
          <div className="signal-strength-visual">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`signal-bar ${bar <= activeBars ? `active ${scenario.signalRating}` : ''}`}
                style={{ height: `${bar * 10}px` }}
              />
            ))}
          </div>

          <p className="signal-rating-title">
            {getSignalRatingText(scenario.signalRating)} — {scenario.title}
          </p>
          <p className="signal-rating-explanation">{scenario.explanation}</p>
        </div>

        {/* Fix plan heading */}
        <h3 className="signal-fix-heading">Recommended steps</h3>

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
        <div className="signal-fix-steps">
          {(activeTab === 'android' ? scenario.fixSteps : scenario.iosFixSteps) &&
            (activeTab === 'android' ? scenario.fixSteps : scenario.iosFixSteps).map((fixStep) => (
              <div key={fixStep.step} className="signal-fix-step">
                <div className="signal-step-number">{fixStep.step}</div>
                <div>
                  <p className="signal-step-title">{fixStep.title}</p>
                  <p className="signal-step-detail">{fixStep.detail}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Action buttons */}
        <button className="signal-home-button" onClick={handleBack}>
          Back to Home
        </button>

        <button className="signal-restart-button" onClick={handleStartAgain}>
          Start again
        </button>

      </div>
    )
  }

  // Show the question flow
  return (
    <div className="signal-container">

      {/* Header */}
      <div className="signal-header">
        <button className="signal-back-button" onClick={handleBack}>
          ← Back
        </button>
        <span className="signal-header-label">Signal Troubleshooter</span>
      </div>

      {/* Intro text on the first question */}
      {currentQuestionIndex === 0 && (
        <div className="signal-intro">
          <h1 className="signal-intro-title">Signal Troubleshooter</h1>
          <p className="signal-intro-subtitle">
            Answer four quick questions about your connectivity
            and we will analyse your signal context and give
            you a personalised fix plan.
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="signal-progress-section">
        <p className="signal-progress-text">
          Question {currentQuestionIndex + 1} of {signalQuestions.length}
        </p>
        <div className="signal-progress-bar-background">
          <div
            className="signal-progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current question */}
      <p className="signal-question-text">{currentQuestion.text}</p>

      {/* Answer options */}
      <div className="signal-options-list">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            className={`signal-option-button ${selectedOption?.id === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Next button appears after an option is selected */}
      {selectedOption && (
        <button className="signal-next-button" onClick={handleNext}>
          {currentQuestionIndex === signalQuestions.length - 1
            ? 'Analyse my signal'
            : 'Next'}
        </button>
      )}

    </div>
  )
}

export default SignalTroubleshooter