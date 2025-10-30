/**
 * Main App component for Narco Life RPG
 * Handles routing, authentication state, and global app structure
 * 
 * Features:
 * - AWS Cognito authentication integration
 * - Protected routes for authenticated users
 * - Global HUD display for player stats
 * - Route management for all game screens
 */

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'

// Import components
import LoginScreen from './components/auth/LoginScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import CharacterSelect from './components/character/CharacterSelect'
import MainMenu from './components/game/MainMenu'
import TravelMap from './components/game/TravelMap'
import Missions from './components/game/Missions'
import Streets from './components/game/Streets'
import Inventory from './components/game/Inventory'
import SkillTree from './components/game/SkillTree'
import HUD from './components/ui/HUD'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  // Authentication and user state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [currentCharacter, setCurrentCharacter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Check authentication status on app load
   * Verifies if user is logged in and retrieves user data
   */
  useEffect(() => {
    checkAuthState()
  }, [])

  /**
   * Checks current authentication state with AWS Cognito
   * Updates app state based on authentication status
   */
  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
      setIsAuthenticated(true)
      
      // Load current character if exists
      const savedCharacter = localStorage.getItem('currentCharacter')
      if (savedCharacter) {
        setCurrentCharacter(JSON.parse(savedCharacter))
      }
    } catch (error) {
      console.log('User not authenticated:', error)
      setIsAuthenticated(false)
      setUser(null)
      setCurrentCharacter(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles user logout
   * Clears authentication state and local storage
   */
  const handleLogout = async () => {
    try {
      await Auth.signOut()
      setIsAuthenticated(false)
      setUser(null)
      setCurrentCharacter(null)
      localStorage.removeItem('currentCharacter')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  /**
   * Handles character selection
   * Updates current character state and saves to local storage
   */
  const handleCharacterSelect = (character) => {
    setCurrentCharacter(character)
    localStorage.setItem('currentCharacter', JSON.stringify(character))
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-charcoal bg-vignette">
      {/* Global HUD - only show when authenticated and character selected */}
      {isAuthenticated && currentCharacter && (
        <HUD 
          character={currentCharacter} 
          onLogout={handleLogout}
        />
      )}

      {/* Main content area */}
      <div className={`${isAuthenticated && currentCharacter ? 'pt-16' : ''}`}>
        <Routes>
          {/* Authentication Routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginScreen onAuthSuccess={checkAuthState} />
              ) : (
                <Navigate to={currentCharacter ? "/menu" : "/characters"} replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <RegisterScreen onAuthSuccess={checkAuthState} />
              ) : (
                <Navigate to={currentCharacter ? "/menu" : "/characters"} replace />
              )
            } 
          />

          {/* Character Management */}
          <Route 
            path="/characters" 
            element={
              isAuthenticated ? (
                <CharacterSelect 
                  user={user}
                  onCharacterSelect={handleCharacterSelect}
                  currentCharacter={currentCharacter}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Game Routes - Protected and require character selection */}
          <Route 
            path="/menu" 
            element={
              isAuthenticated && currentCharacter ? (
                <MainMenu character={currentCharacter} />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />
          <Route 
            path="/travel" 
            element={
              isAuthenticated && currentCharacter ? (
                <TravelMap 
                  character={currentCharacter} 
                  onCharacterUpdate={setCurrentCharacter}
                />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />
          <Route 
            path="/missions" 
            element={
              isAuthenticated && currentCharacter ? (
                <Missions 
                  character={currentCharacter} 
                  onCharacterUpdate={setCurrentCharacter}
                />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />
          <Route 
            path="/streets" 
            element={
              isAuthenticated && currentCharacter ? (
                <Streets 
                  character={currentCharacter} 
                  onCharacterUpdate={setCurrentCharacter}
                />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />
          <Route 
            path="/inventory" 
            element={
              isAuthenticated && currentCharacter ? (
                <Inventory 
                  character={currentCharacter} 
                  onCharacterUpdate={setCurrentCharacter}
                />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />
          <Route 
            path="/skills" 
            element={
              isAuthenticated && currentCharacter ? (
                <SkillTree 
                  character={currentCharacter} 
                  onCharacterUpdate={setCurrentCharacter}
                />
              ) : (
                <Navigate to={isAuthenticated ? "/characters" : "/login"} replace />
              )
            } 
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={
                  isAuthenticated 
                    ? (currentCharacter ? "/menu" : "/characters")
                    : "/login"
                } 
                replace 
              />
            } 
          />
        </Routes>
      </div>
    </div>
  )
}

export default App