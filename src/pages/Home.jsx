import { useNavigate } from 'react-router-dom'
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

  const handleCategoryClick = (categoryId) => {
    navigate(`/qa/${categoryId}`)
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">FixMyPhone</h1>
        <p className="home-subtitle">
          Answer a few questions and get a step-by-step fix plan for your phone problem.
        </p>
      </div>

      <p className="categories-label">Select your issue</p>

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
    </div>
  )
}

export default Home