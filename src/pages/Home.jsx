/*
  Home.jsx
  --------
  The Home page of FixMyPhone. This is the first screen
  the user sees. It shows:
  - The app title and subtitle
  - Five issue category cards to select from
  - A Signal Troubleshooter banner
  - A session history section showing previous sessions
    saved to this browser using localStorage
*/

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessionHistory, clearSessionHistory } from '../services/sessionHistory'
import './Home.css'

const categories = [
  {
    id: 'performance',
    name: 'Performance',
    desc: 'Phone running slow or freezing',
    icon: '⚡',
    color: '#fff4e6',
  },
  {
    id: 'battery',
    name: 'Battery & Heat',
    desc: 'Battery draining fast or overheating',
    icon: '🔋',
    color: '#fff0f0',
  },
  {
    id: 'apps',
    name: 'Apps',
    desc: 'Apps crashing or not loading',
    icon: '📱',
    color: '#f0fff4',
  },
  {
    id: 'wifi',
    name: 'Wi-Fi & Bluetooth',
    desc: 'Connection problems with Wi-Fi or Bluetooth',
    icon: '📶',
    color: '#f0f7ff',
  },
  {
    id: 'signal',
    name: 'Mobile Signal',
    desc: 'No service, weak signal or dropped calls',
    icon: '📡',
    color: '#f5f0ff',
  },
]

function Home() {
  const navigate = useNavigate()

  // Load session history from localStorage
  const [sessionHistory, setSessionHistory] = useState([])

  // Load history when the page opens
  useEffect(() => {
    const history = getSessionHistory()
    setSessionHistory(history)
  }, [])

  // Handle clicking a category card
  const handleCategoryClick = (categoryId) => {
    navigate(`/qa/${categoryId}`)
  }

  // Handle clearing the session history
  const handleClearHistory = () => {
    clearSessionHistory()
    setSessionHistory([])
  }

  // Format a date string into a readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="home-container">

      {/* App title and subtitle */}
      <div className="home-header">
        <div className="home-logo">
          <h1 className="home-title"> FixMyPhone<span className="home-logo-icon">📱</span></h1>
        </div>
        <p className="home-subtitle">
          Answer a few questions and get a step-by-step fix plan for your phone problem.
        </p>
      </div>

      {/* Category selector label */}
      <p className="categories-label">Select your issue</p>

      {/* Category cards */}
      <div className="categories-list">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-left">
              <div
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <div>
                <p className="category-name">{category.name}</p>
                <p className="category-desc">{category.desc}</p>
              </div>
            </div>
            <span className="category-arrow">›</span>
          </div>
        ))}
      </div>

      {/* Signal Troubleshooter banner */}
      <div
        className="signal-banner"
        onClick={() => navigate('/signal')}
      >
        <div className="signal-banner-text">
          <h3>Signal Troubleshooter</h3>
          <p>Diagnose mobile network and coverage issues</p>
        </div>
        <span className="signal-banner-arrow">›</span>
      </div>

      {/* Session history section - only shown if there are saved sessions */}
      {sessionHistory.length > 0 && (
        <div className="history-section">

          {/* History header with clear button */}
          <div className="history-header">
            <p className="history-label">Previous sessions</p>
            <button
              className="history-clear-button"
              onClick={handleClearHistory}
            >
              Clear
            </button>
          </div>

          {/* List of previous sessions */}
          <div className="history-list">
            {sessionHistory.map((entry) => (
              <div
                key={entry.sessionId}
                className="history-item"
                onClick={() => navigate(`/summary/${entry.sessionId}`)}
              >
                <div className="history-item-left">
                  <p className="history-item-category">{entry.categoryLabel}</p>
                  <p className="history-item-cause">{entry.causeTitle}</p>
                  <p className="history-item-date">{formatDate(entry.date)}</p>
                </div>
                <span className="history-item-arrow">›</span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}

export default Home