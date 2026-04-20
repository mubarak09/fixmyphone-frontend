/*
  QAFlow.jsx
  ----------
  This is the guided Q&A screen. It fetches questions for the
  selected category from the backend API, shows one question
  at a time, collects the user's answers, and either:
  - Sends them to a "Problem Solved" screen if they pick an exit answer
  - Sends them to the Results page when all questions are answered
*/

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuestions } from '../services/api'
import './QAFlow.css'

function QAFlow() {

  // Get the category id from the URL e.g. /qa/signal gives us "signal"
  const { categoryId } = useParams()

  // useNavigate lets us send the user to a different page
  const navigate = useNavigate()

  // Store the questions fetched from the API
  const [questions, setQuestions] = useState([])

  // Store the category label for display
  const [categoryLabel, setCategoryLabel] = useState('')

  // Track which question we are currently on (starts at 0 = first question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Track which answer the user has selected for the current question
  const [selectedOption, setSelectedOption] = useState(null)

  // Store all answers the user has given so far
  const [answers, setAnswers] = useState([])

  // Track whether questions are still loading from the API
  const [loading, setLoading] = useState(true)

  // Track any error that occurs during the API call
  const [error, setError] = useState(null)

  // Fetch questions from the API when the component loads
  useEffect(() => {

    // Map category ids to their display labels
    const categoryLabels = {
      signal: 'Mobile Signal',
      performance: 'Performance',
      battery: 'Battery and Heat',
      apps: 'Apps',
      wifi: 'Wi-Fi and Bluetooth'
    }

    // Set the label for the current category
    setCategoryLabel(categoryLabels[categoryId] || categoryId)

    // Fetch the questions from the backend
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const data = await getQuestions(categoryId)
        setQuestions(data)
        setLoading(false)
      } catch (err) {
        setError('Could not load questions. Please check your connection and try again.')
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [categoryId])

  // Show a loading message while questions are being fetched
  if (loading) {
    return (
      <div className="qa-container">
        <div className="qa-loading">
          <p>Loading questions...</p>
        </div>
      </div>
    )
  }

  // Show an error message if the API call failed
  if (error) {
    return (
      <div className="qa-container">
        <div className="qa-error">
          <p>{error}</p>
          <button className="qa-back-button" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // If no questions came back show a not found message
  if (questions.length === 0) {
    return (
      <div className="qa-container">
        <p>No questions found for this category.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  // Get the current question object based on the current index
  const currentQuestion = questions[currentQuestionIndex]

  // Calculate the progress percentage for the progress bar
  const progressPercentage = (currentQuestionIndex / questions.length) * 100

  // Handle when the user clicks an answer option
  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  // Handle when the user clicks the Next button
  const handleNext = () => {

    // Save the current answer to our answers array
    const updatedAnswers = [
      ...answers,
      {
        questionId: currentQuestion.questionId,
        questionText: currentQuestion.text,
        answerId: selectedOption.id,
        answerText: selectedOption.text
      }
    ]

    setAnswers(updatedAnswers)

    // Check if the selected answer has the exits flag
    // If it does the problem is solved so go to the solved screen
    if (selectedOption.exits) {
      navigate('/solved', {
        state: {
          categoryId: categoryId,
          categoryLabel: categoryLabel,
          fixedBy: selectedOption.fixDescription,
          answers: updatedAnswers
        }
      })
      return
    }

    // Check if this was the last question
    // If it was go to the Results page with all the answers
    if (currentQuestionIndex === questions.length - 1) {
      navigate('/results', {
        state: {
          categoryId: categoryId,
          categoryLabel: categoryLabel,
          answers: updatedAnswers
        }
      })
      return
    }

    // Otherwise move to the next question and clear the selected option
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedOption(null)
  }

  // Handle the back button - go back to the Home page
  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="qa-container">

      {/* Header with back button and category name */}
      <div className="qa-header">
        <button className="qa-back-button" onClick={handleBack}>
          ← Back
        </button>
        <span className="qa-category-label">{categoryLabel}</span>
      </div>

      {/* Progress bar showing how far through the questions the user is */}
      <div className="qa-progress-section">
        <p className="qa-progress-text">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="qa-progress-bar-background">
          <div
            className="qa-progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* The current question text */}
      <p className="qa-question-text">{currentQuestion.text}</p>

      {/* The list of answer options */}
      <div className="qa-options-list">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            className={`qa-option-button ${selectedOption?.id === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Next button only appears after an option is selected */}
      {selectedOption && (
        <button className="qa-next-button" onClick={handleNext}>
          {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next'}
        </button>
      )}

    </div>
  )
}

export default QAFlow