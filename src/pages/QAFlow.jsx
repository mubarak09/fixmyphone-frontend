/*
  QAFlow.jsx
  ----------
  This is the guided Q&A screen. It loads questions for the
  selected category from a local JSON file, shows one question
  at a time, collects the user's answers, and either:
  - Sends them to a "Problem Solved" screen if they pick an exit answer
  - Sends them to the Results page when all questions are answered
*/

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import questionsData from '../data/questions.json'
import './QAFlow.css'

function QAFlow() {

  // Get the category id from the URL e.g. /qa/signal gives us "signal"
  const { categoryId } = useParams()

  // useNavigate lets us send the user to a different page
  const navigate = useNavigate()

  // Load the questions for this specific category from the JSON file
  const categoryData = questionsData[categoryId]

  // Track which question we are currently on (starts at 0 = first question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Track which answer the user has selected for the current question
  const [selectedOption, setSelectedOption] = useState(null)

  // Store all answers the user has given so far
  const [answers, setAnswers] = useState([])

  // If the category does not exist in our data show an error message
  if (!categoryData) {
    return (
      <div className="qa-container">
        <p>Category not found. Please go back and try again.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  // Get the full list of questions for this category
  const questions = categoryData.questions

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
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answerId: selectedOption.id,
        answerText: selectedOption.text
      }
    ]

    setAnswers(updatedAnswers)

    // Check if the selected answer has the exits flag
    // If it does, the problem is solved so go to the solved screen
    if (selectedOption.exits) {
      navigate('/solved', {
        state: {
          categoryId: categoryId,
          categoryLabel: categoryData.label,
          fixedBy: selectedOption.fixDescription,
          answers: updatedAnswers
        }
      })
      return
    }

    // Check if this was the last question
    // If it was, go to the Results page with all the answers
    if (currentQuestionIndex === questions.length - 1) {
      navigate('/results', {
        state: {
          categoryId: categoryId,
          categoryLabel: categoryData.label,
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
        <span className="qa-category-label">{categoryData.label}</span>
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