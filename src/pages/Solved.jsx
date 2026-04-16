/*
  Solved.jsx
  ----------
  This page is shown when the user picks an answer that
  has the "exits: true" flag in the questions JSON.
  It means the fix they tried actually worked and their
  problem is resolved. We congratulate them and give them
  the option to go home or save their session.
*/

import { useLocation, useNavigate } from 'react-router-dom'
import './Solved.css'

function Solved() {

  // useLocation lets us read the data passed from the QAFlow page
  const location = useLocation()
  const navigate = useNavigate()

  // Get the data that was passed when navigating here
  const { categoryLabel, fixedBy } = location.state || {}

  return (
    <div className="solved-container">

      {/* Success icon */}
      <div className="solved-icon">✓</div>

      {/* Main message */}
      <h1 className="solved-title">Problem Solved!</h1>

      <p className="solved-subtitle">
        Great news — your {categoryLabel} issue appears to be resolved.
      </p>

      {/* Show what fixed it */}
      <div className="solved-fix-card">
        <p className="solved-fix-label">What fixed it</p>
        <p className="solved-fix-text">{fixedBy}</p>
      </div>

      <p className="solved-advice">
        If the problem comes back, come back and complete the full diagnostic for a detailed fix plan.
      </p>

      {/* Go back home button */}
      <button
        className="solved-home-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>

    </div>
  )
}

export default Solved