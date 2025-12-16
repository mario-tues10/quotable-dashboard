### Quotable Dashboard

A React + TypeScript dashboard for viewing user metrics from the Quotable backend.
Includes Firebase authentication, metric visualization, and secure API integration.

### Features

Email/password login using Firebase Authentication

Protected dashboard route

Daily Active Users (DAU) metric (last 30 days)

Summary cards (latest DAU, total DAU, days loaded)

Data table for DAU

Error handling & loading states

Vite proxy to prevent CORS issues

### Installation & Setup
1. Install Dependencies
git clone https://github.com/your-username/quotable-dashboard.git
cd quotable-dashboard
npm install

2. Create Environment File

Copy the example file:

cp .env.example .env


Fill in:

VITE_FIREBASE_API_KEY=YOUR_FIREBASE_KEY
VITE_QUOTABLE_API_BASE_URL=/api
VITE_TEST_EMAIL=dev_test@podego.com
VITE_TEST_PASSWORD=your_password

3. Run the Project
npm run dev


Open:

http://localhost:5173

### Authentication

The login page uses Firebase’s REST API:

POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<FIREBASE_KEY>


If successful, the returned idToken is stored in localStorage and attached to all API requests:

Authorization: Bearer token <idToken>


If authentication fails or the token is invalid, the dashboard displays an error.

### Backend Access (Vite Proxy)

All API requests use the /api prefix.
Vite forwards them to the real backend and removes /api to avoid CORS:

server: {
  proxy: {
    '/api': {
      target: 'https://quotable-966464862995.europe-west4.run.app',
      changeOrigin: true,
      secure: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}

### Metrics

The dashboard currently supports Daily Active Users.

Backend response:

{
  "dates": [...],
  "counts": [...]
}


Frontend converts this into:

[{ date: string, count: number }]


Displayed as:

Summary metric cards

Table of all values

### Project Structure (Brief)
src/
  components/
  pages/
  services/
  context/
  hooks/
  types/
  App.tsx
  main.tsx
