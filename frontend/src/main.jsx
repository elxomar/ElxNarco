/**
 * Main entry point for the Narco Life RPG React application
 * Sets up React Router, AWS Amplify configuration, and renders the root App component
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import App from './App.jsx'
import './index.css'

// AWS Amplify configuration
// TODO: Replace with actual AWS configuration values
const amplifyConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XXXXXXXXX',
    userPoolWebClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  API: {
    endpoints: [
      {
        name: 'narcoLifeAPI',
        endpoint: 'https://api.example.com/dev',
        region: 'us-east-1'
      }
    ]
  }
}

// Configure Amplify with the settings above
Amplify.configure(amplifyConfig)

// Render the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)