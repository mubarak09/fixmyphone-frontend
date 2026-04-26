/*
  App.jsx
  -------
  This is the root component of the app.
  It sets up all the routes (pages) using React Router.
  Each route maps a URL path to a page component.
*/

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QAFlow from './pages/QAFlow'
import Results from './pages/Results'
import SignalTroubleshooter from './pages/SignalTroubleshooter'
import Solved from './pages/Solved'
import Summary from './pages/Summary'

function App() {
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