/*
  App.jsx
  -------
  This is the root component of the app.
  It sets up all the routes (pages) using React Router.
  It also runs a keep-alive ping to the backend every
  14 minutes to prevent the Render free tier from
  spinning down between API calls.
*/

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QAFlow from './pages/QAFlow'
import Results from './pages/Results'
import SignalTroubleshooter from './pages/SignalTroubleshooter'
import Solved from './pages/Solved'
import Summary from './pages/Summary'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {

  // Ping the backend every 14 minutes to keep it awake
  // Render free tier spins down after 15 minutes of inactivity
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await fetch(`${BASE_URL}/api/health`)
        console.log('Backend pinged successfully')
      } catch (error) {
        console.log('Backend ping failed:', error)
      }
    }

    // Ping immediately when the app loads
    pingBackend()

    // Then ping every 14 minutes
    const interval = setInterval(pingBackend, 14 * 60 * 1000)

    // Clear the interval when the app unmounts
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Home page - category selector */}
        <Route path="/" element={<Home />} />

        {/* Q&A flow - categoryId comes from the URL e.g. /qa/signal */}
        <Route path="/qa/:categoryId" element={<QAFlow />} />

        {/* Results page - shown when all questions are answered */}
        <Route path="/results" element={<Results />} />

        {/* Problem Solved page - shown when an exit answer is selected */}
        <Route path="/solved" element={<Solved />} />

        {/* Signal Troubleshooter - separate dedicated flow */}
        <Route path="/signal" element={<SignalTroubleshooter />} />

        {/* Summary page - shown when user views escalation summary */}
        <Route path="/summary/:sessionId" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App