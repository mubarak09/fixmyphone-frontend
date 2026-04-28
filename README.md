# FixMyPhone — Mobile Troubleshooting Assistant

A web-based mobile troubleshooting assistant that guides users through a 
structured, interactive step-by-step diagnosis flow for common smartphone 
problems. Built as a Final Year Project at South East Technological University.

**Live App:** https://fixmyphone-frontend.vercel.app  
**Student:** Mubarak Alabi — 20098236  
**Programme:** BSc (Hons) Software Systems Development  
**Supervisor:** Dr Rahul Mhapsekar  

---

## What the app does

FixMyPhone guides users through a series of targeted questions about their 
phone problem. A rule-based scoring engine analyses their answers and returns 
the most likely cause along with a numbered step-by-step fix plan.

The app covers two core areas:

- **General device troubleshooting** — Performance, Battery and Heat, 
  Apps, Wi-Fi and Bluetooth, Mobile Signal
- **Signal Troubleshooter** — A dedicated flow that collects connectivity 
  context and matches it against simulated signal scenarios to provide 
  network-specific guidance

Additional features include:
- Early exit when a fix works mid-flow with a Problem Solved screen
- Escalation summary that can be copied and shared with a support agent
- Session history saved to localStorage so users can review previous sessions

---

## Tech Stack

| Layer | Technology |
|---|-|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend), Render (backend) |
| Version Control | GitHub |

---

## Running locally

### Prerequisites
- Node.js v18 or higher
- The backend running locally or deployed on Render

### Steps

1. Clone the repository
```
git clone https://github.com/mubarak09/fixmyphone-frontend.git
cd fixmyphone-frontend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root folder
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server
```
npm run dev
```

5. Open your browser at `http://localhost:5173`

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | The base URL of the backend API |

---

## Related Repository

Backend repository: https://github.com/mubarak09/fixmyphone-backend

---

## Acknowledgements

This project was developed as part of the Final Year Project module at 
South East Technological University Waterford, 2025-26.