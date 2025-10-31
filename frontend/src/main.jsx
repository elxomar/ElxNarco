/**
 * Main entry point for the Narco Life RPG React application
 * Sets up React Router and renders the root App component
 * 
 * Note: AWS Amplify configuration disabled for local testing
 * Using localStorage-based mock authentication instead
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Mock AWS Amplify Auth for local testing
// This replaces AWS Cognito with localStorage-based authentication
window.mockAuth = {
  currentAuthenticatedUser: () => {
    const user = localStorage.getItem('mockUser')
    if (user) {
      return Promise.resolve(JSON.parse(user))
    }
    return Promise.reject(new Error('No authenticated user'))
  },
  
  signIn: (email, password) => {
    // Simple mock authentication - in production, this would validate against AWS Cognito
    if (email && password) {
      const user = {
        username: email.split('@')[0],
        email: email,
        attributes: {
          email: email
        }
      }
      localStorage.setItem('mockUser', JSON.stringify(user))
      return Promise.resolve(user)
    }
    return Promise.reject(new Error('Invalid credentials'))
  },
  
  signUp: (email, password, attributes) => {
    // Mock user registration
    if (email && password) {
      const user = {
        username: email.split('@')[0],
        email: email,
        attributes: {
          email: email,
          ...attributes
        }
      }
      localStorage.setItem('mockUser', JSON.stringify(user))
      return Promise.resolve({ user })
    }
    return Promise.reject(new Error('Registration failed'))
  },
  
  signOut: () => {
    localStorage.removeItem('mockUser')
    localStorage.removeItem('currentCharacter')
    return Promise.resolve()
  }
}

// Replace AWS Auth with mock implementation
window.Auth = window.mockAuth

// Render the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)