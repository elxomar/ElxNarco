/**
 * RegisterScreen Component
 * Handles user registration using AWS Cognito
 * 
 * Features:
 * - Email/password registration form with confirmation
 * - Form validation and password strength checking
 * - Email confirmation handling
 * - Navigation to login screen
 * - Responsive design with RPG theme styling
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const RegisterScreen = ({ onAuthSuccess }) => {
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')

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
   * Validates password strength
   * Returns true if password meets requirements
   */
  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }

  /**
   * Handles form submission for user registration
   * Creates new user account with AWS Cognito
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate form data
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
        throw new Error('Please fill in all fields')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (!validatePassword(formData.password)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters')
      }

      // Attempt to sign up with AWS Cognito
      const { user } = await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          preferred_username: formData.username
        }
      })

      console.log('Registration successful:', user)
      setSuccess('Registration successful! Please check your email for a confirmation code.')
      setNeedsConfirmation(true)
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle specific AWS Cognito errors
      switch (error.code) {
        case 'UsernameExistsException':
          setError('An account with this email already exists')
          break
        case 'InvalidPasswordException':
          setError('Password does not meet requirements')
          break
        case 'InvalidParameterException':
          setError('Invalid email format')
          break
        default:
          setError(error.message || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles email confirmation code submission
   * Confirms user account and signs them in
   */
  const handleConfirmation = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!confirmationCode) {
        throw new Error('Please enter the confirmation code')
      }

      // Confirm sign up with AWS Cognito
      await Auth.confirmSignUp(formData.email, confirmationCode)
      
      // Automatically sign in the user after confirmation
      await Auth.signIn(formData.email, formData.password)
      
      setSuccess('Account confirmed successfully! Welcome to Narco Life RPG!')
      
      // Call success callback to update app state
      setTimeout(() => {
        onAuthSuccess()
      }, 1500)
    } catch (error) {
      console.error('Confirmation error:', error)
      
      switch (error.code) {
        case 'CodeMismatchException':
          setError('Invalid confirmation code')
          break
        case 'ExpiredCodeException':
          setError('Confirmation code has expired. Please request a new one.')
          break
        default:
          setError(error.message || 'Confirmation failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Resends confirmation code to user's email
   */
  const resendConfirmationCode = async () => {
    try {
      await Auth.resendSignUp(formData.email)
      setSuccess('Confirmation code resent to your email')
    } catch (error) {
      setError('Failed to resend confirmation code')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            NARCO LIFE RPG
          </h1>
          <p className="text-gray-400 text-lg">
            Join the Underground
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6 text-pale-white">
            {needsConfirmation ? 'Confirm Your Account' : 'Create Account'}
          </h2>

          {/* Success Message */}
          {success && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {needsConfirmation ? (
            /* Confirmation Form */
            <form onSubmit={handleConfirmation} className="space-y-4">
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter 6-digit code from email"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Confirming...' : 'Confirm Account'}
              </button>

              <button
                type="button"
                onClick={resendConfirmationCode}
                className="btn-secondary w-full"
              >
                Resend Code
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                />
              </div>

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
                  placeholder="Create a strong password"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, numbers, and special characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Confirm your password"
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          {!needsConfirmation && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-muted-gold hover:text-yellow-400 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Narco Life RPG. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen