/**
 * LoginScreen Component
 * Handles user authentication using AWS Cognito
 * 
 * Features:
 * - Email/password login form
 * - Form validation and error handling
 * - Navigation to registration screen
 * - Responsive design with RPG theme styling
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const LoginScreen = ({ onAuthSuccess }) => {
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handles input field changes
   * Updates form state with new values
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  /**
   * Handles form submission for user login
   * Authenticates user with AWS Cognito and calls success callback
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields')
      }

      // Attempt to sign in with AWS Cognito
      await Auth.signIn(formData.email, formData.password)
      
      // Call success callback to update app state
      onAuthSuccess()
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific AWS Cognito errors
      switch (error.code) {
        case 'UserNotConfirmedException':
          setError('Please confirm your email address before logging in')
          break
        case 'NotAuthorizedException':
          setError('Invalid email or password')
          break
        case 'UserNotFoundException':
          setError('No account found with this email address')
          break
        default:
          setError(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            NARCO LIFE RPG
          </h1>
          <p className="text-gray-400 text-lg">
            Enter the Underground
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6 text-pale-white">
            Sign In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-muted-gold hover:text-yellow-400 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button 
              type="button"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              onClick={() => {
                // TODO: Implement forgot password functionality
                alert('Forgot password functionality coming soon!')
              }}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Narco Life RPG. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen