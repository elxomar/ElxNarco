/**
 * CharacterSelect Component
 * Manages character creation, selection, and deletion
 * 
 * Features:
 * - Display up to 3 character slots per user
 * - Create new characters with customization
 * - Select existing characters to play
 * - Delete characters with confirmation
 * - Character stats preview
 * - Integration with DynamoDB for persistence
 */

import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'

const CharacterSelect = ({ user, onCharacterSelect, currentCharacter }) => {
  // Component state
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Character creation form state
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    startingLocation: 'Los Angeles'
  })

  // Available starting locations
  const startingLocations = [
    { id: 'los-angeles', name: 'Los Angeles', country: 'USA', description: 'City of Angels, city of opportunities' },
    { id: 'miami', name: 'Miami', country: 'USA', description: 'Vice and paradise in the sunshine state' },
    { id: 'new-york', name: 'New York', country: 'USA', description: 'The concrete jungle where dreams are made' },
    { id: 'tijuana', name: 'Tijuana', country: 'Mexico', description: 'Border town with endless possibilities' },
    { id: 'juarez', name: 'Juarez', country: 'Mexico', description: 'Industrial hub of the north' },
    { id: 'puerto-vallarta', name: 'Puerto Vallarta', country: 'Mexico', description: 'Coastal paradise with hidden dangers' }
  ]

  /**
   * Load user's characters on component mount
   */
  useEffect(() => {
    loadCharacters()
  }, [user])

  /**
   * Loads characters from the backend API
   * Fetches all characters associated with the current user
   */
  const loadCharacters = async () => {
    try {
      setIsLoading(true)
      setError('')

      // TODO: Replace with actual API call to fetch characters
      // For now, use mock data or localStorage
      const savedCharacters = localStorage.getItem(`characters_${user.username}`)
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters))
      } else {
        setCharacters([])
      }
    } catch (error) {
      console.error('Error loading characters:', error)
      setError('Failed to load characters. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Creates a new character
   * Validates input and saves to backend
   */
  const createCharacter = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')

    try {
      // Validate character name
      if (!newCharacter.name.trim()) {
        throw new Error('Character name is required')
      }

      if (newCharacter.name.length < 3 || newCharacter.name.length > 20) {
        throw new Error('Character name must be between 3 and 20 characters')
      }

      // Check if name already exists
      if (characters.some(char => char.name.toLowerCase() === newCharacter.name.toLowerCase())) {
        throw new Error('A character with this name already exists')
      }

      // Check character limit
      if (characters.length >= 3) {
        throw new Error('Maximum of 3 characters allowed per account')
      }

      // Create character object
      const character = {
        id: Date.now().toString(), // Simple ID generation for demo
        userId: user.username,
        name: newCharacter.name.trim(),
        location: newCharacter.startingLocation,
        level: 1,
        xp: 0,
        cash: 1000, // Starting cash
        health: 100,
        stamina: 100,
        skills: {
          strength: 1,
          intelligence: 1,
          endurance: 1,
          shooting: 1
        },
        inventory: {
          items: [],
          drugs: []
        },
        completedMissions: [],
        createdAt: new Date().toISOString()
      }

      // TODO: Replace with actual API call to create character
      const updatedCharacters = [...characters, character]
      setCharacters(updatedCharacters)
      localStorage.setItem(`characters_${user.username}`, JSON.stringify(updatedCharacters))

      // Reset form and close modal
      setNewCharacter({ name: '', startingLocation: 'Los Angeles' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating character:', error)
      setError(error.message || 'Failed to create character. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * Deletes a character after confirmation
   */
  const deleteCharacter = async (characterId) => {
    try {
      setError('')

      // TODO: Replace with actual API call to delete character
      const updatedCharacters = characters.filter(char => char.id !== characterId)
      setCharacters(updatedCharacters)
      localStorage.setItem(`characters_${user.username}`, JSON.stringify(updatedCharacters))

      // Clear current character if it was deleted
      if (currentCharacter && currentCharacter.id === characterId) {
        localStorage.removeItem('currentCharacter')
      }

      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting character:', error)
      setError('Failed to delete character. Please try again.')
    }
  }

  /**
   * Calculates character level based on XP
   */
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-gray border-t-muted-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading characters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            Select Character
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your identity in the underworld
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Character Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map(slotIndex => {
            const character = characters[slotIndex]
            
            return (
              <div key={slotIndex} className="card min-h-[300px] flex flex-col">
                {character ? (
                  /* Existing Character */
                  <>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-muted-gold">
                          {character.name}
                        </h3>
                        <button
                          onClick={() => setDeleteConfirm(character.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          title="Delete Character"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Level:</span> {calculateLevel(character.xp)}</p>
                        <p><span className="text-gray-400">Location:</span> {character.location}</p>
                        <p><span className="text-gray-400">Cash:</span> <span className="text-green-400">${character.cash.toLocaleString()}</span></p>
                        <p><span className="text-gray-400">XP:</span> <span className="text-blue-400">{character.xp}</span></p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Skills</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>STR: {character.skills.strength}</div>
                          <div>INT: {character.skills.intelligence}</div>
                          <div>END: {character.skills.endurance}</div>
                          <div>SHT: {character.skills.shooting}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onCharacterSelect(character)}
                      className={`btn-primary w-full mt-4 ${
                        currentCharacter && currentCharacter.id === character.id 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : ''
                      }`}
                    >
                      {currentCharacter && currentCharacter.id === character.id 
                        ? 'Currently Selected' 
                        : 'Select Character'
                      }
                    </button>
                  </>
                ) : (
                  /* Empty Slot */
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl text-gray-600 mb-4">👤</div>
                    <p className="text-gray-400 mb-4">Empty Slot</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="btn-secondary"
                    >
                      Create Character
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Create Character Button (if slots available) */}
        {characters.length < 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              + Create New Character
            </button>
          </div>
        )}

        {/* Create Character Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6 text-muted-gold">
                Create Character
              </h2>

              <form onSubmit={createCharacter} className="space-y-4">
                {/* Character Name */}
                <div>
                  <label htmlFor="characterName" className="block text-sm font-medium text-gray-300 mb-2">
                    Character Name
                  </label>
                  <input
                    type="text"
                    id="characterName"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Enter character name"
                    required
                    disabled={isCreating}
                    maxLength={20}
                  />
                </div>

                {/* Starting Location */}
                <div>
                  <label htmlFor="startingLocation" className="block text-sm font-medium text-gray-300 mb-2">
                    Starting Location
                  </label>
                  <select
                    id="startingLocation"
                    value={newCharacter.startingLocation}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, startingLocation: e.target.value }))}
                    className="input-field w-full"
                    disabled={isCreating}
                  >
                    {startingLocations.map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}, {location.country}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {startingLocations.find(loc => loc.name === newCharacter.startingLocation)?.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewCharacter({ name: '', startingLocation: 'Los Angeles' })
                      setError('')
                    }}
                    className="btn-secondary flex-1"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-xl font-bold text-center mb-4 text-red-400">
                Delete Character
              </h2>
              <p className="text-center text-gray-300 mb-6">
                Are you sure you want to delete this character? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCharacter(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex-1 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterSelect