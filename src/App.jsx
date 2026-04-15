import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QAFlow from './pages/QAFlow'
import Results from './pages/Results'
import SignalTroubleshooter from './pages/SignalTroubleshooter'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qa" element={<QAFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/signal" element={<SignalTroubleshooter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App