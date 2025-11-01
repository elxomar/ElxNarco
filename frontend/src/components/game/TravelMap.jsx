/**
 * TravelMap Component - Mobile-Optimized Interactive Travel System
 * Professional travel interface for navigating between cities in Mexico and USA
 * 
 * Features:
 * - Mobile-first responsive design with touch-friendly interactions
 * - Visual map with clickable city locations optimized for mobile
 * - Travel cost and stamina requirements with clear visual feedback
 * - Professional confirmation modal with detailed cost breakdown
 * - Real-time updates to character location with smooth animations
 * - Separate regions (Mexico vs USA) with distinct visual styling
 * - Back button navigation for seamless user experience
 * - Accessibility support with proper ARIA labels and keyboard navigation
 * 
 * Mobile Optimizations:
 * - Touch-friendly city markers with adequate spacing
 * - Responsive grid layout for city information cards
 * - Optimized modal design for mobile screens
 * - Thumb-friendly button placement and sizing
 */

import React, { useState } from 'react'
import { BackButtonHeader } from '../ui/BackButton'

const TravelMap = ({ character, onCharacterUpdate }) => {
  const [selectedCity, setSelectedCity] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isTravel, setIsTraveling] = useState(false)

  // Available cities with travel costs and requirements
  const cities = {
    usa: [
      {
        id: 'los-angeles',
        name: 'Los Angeles',
        country: 'USA',
        description: 'City of Angels - Entertainment capital with endless opportunities',
        travelCost: 200,
        staminaCost: 15,
        coordinates: { x: 15, y: 65 }
      },
      {
        id: 'miami',
        name: 'Miami',
        country: 'USA', 
        description: 'Vice City - Tropical paradise with a dark underbelly',
        travelCost: 300,
        staminaCost: 20,
        coordinates: { x: 85, y: 75 }
      },
      {
        id: 'new-york',
        name: 'New York',
        country: 'USA',
        description: 'The Big Apple - Where fortunes are made and lost',
        travelCost: 250,
        staminaCost: 18,
        coordinates: { x: 80, y: 35 }
      }
    ],
    mexico: [
      {
        id: 'tijuana',
        name: 'Tijuana',
        country: 'Mexico',
        description: 'Border town - Gateway between two worlds',
        travelCost: 150,
        staminaCost: 12,
        coordinates: { x: 20, y: 80 }
      },
      {
        id: 'juarez',
        name: 'Juarez',
        country: 'Mexico',
        description: 'Industrial hub - Manufacturing and smuggling center',
        travelCost: 180,
        staminaCost: 14,
        coordinates: { x: 45, y: 70 }
      },
      {
        id: 'puerto-vallarta',
        name: 'Puerto Vallarta',
        country: 'Mexico',
        description: 'Coastal paradise - Tourist destination with hidden secrets',
        travelCost: 220,
        staminaCost: 16,
        coordinates: { x: 25, y: 85 }
      }
    ]
  }

  /**
   * Handles city selection
   */
  const handleCityClick = (city) => {
    if (city.name === character.location) {
      return // Can't travel to current location
    }
    setSelectedCity(city)
    setShowConfirmation(true)
  }

  /**
   * Confirms and executes travel
   */
  const confirmTravel = async () => {
    if (!selectedCity) return

    setIsTraveling(true)

    try {
      // Check if player has enough resources
      if (character.cash < selectedCity.travelCost) {
        alert('Not enough cash for this trip!')
        return
      }

      if (character.stamina < selectedCity.staminaCost) {
        alert('Not enough stamina for this trip!')
        return
      }

      // Update character with new location and deduct costs
      const updatedCharacter = {
        ...character,
        location: selectedCity.name,
        cash: character.cash - selectedCity.travelCost,
        stamina: Math.max(0, character.stamina - selectedCity.staminaCost)
      }

      // TODO: Save to backend API
      onCharacterUpdate(updatedCharacter)
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Add to activity log
      const activity = {
        id: Date.now(),
        type: 'location_arrived',
        message: `Traveled to ${selectedCity.name}`,
        timestamp: new Date().toISOString()
      }
      
      const savedActivity = localStorage.getItem(`activity_${character.id}`) || '[]'
      const activityList = JSON.parse(savedActivity)
      activityList.unshift(activity)
      localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 50)))

      setShowConfirmation(false)
      setSelectedCity(null)
    } catch (error) {
      console.error('Travel error:', error)
      alert('Travel failed. Please try again.')
    } finally {
      setIsTraveling(false)
    }
  }

  /**
   * Gets all cities as a flat array
   */
  const getAllCities = () => {
    return [...cities.usa, ...cities.mexico]
  }

  return (
    <div className="min-h-screen py-4 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <BackButtonHeader 
          title="Travel Map" 
          to="/menu"
          className="mb-6"
        />

        {/* Current Status */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-base md:text-lg mb-3">
            Current Location: <span className="text-muted-gold font-semibold">{character.location}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-deep-gray bg-opacity-50 px-3 py-2 rounded-lg border border-gray-600">
              <span>💰 Cash: <span className="text-green-400 font-bold">${character.cash.toLocaleString()}</span></span>
            </div>
            <div className="bg-deep-gray bg-opacity-50 px-3 py-2 rounded-lg border border-gray-600">
              <span>⚡ Stamina: <span className="text-blue-400 font-bold">{character.stamina}/100</span></span>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="card mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-muted-gold mb-4 text-center">
            North America
          </h2>
          
          <div className="relative bg-gradient-to-b from-blue-900 to-green-900 rounded-lg p-4 md:p-8 min-h-[400px] md:min-h-[500px] overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg"></div>
            </div>

            {/* USA Region Label */}
            <div className="absolute top-2 md:top-4 left-2 md:left-4 text-lg md:text-xl font-bold text-blue-300">
              🇺🇸 United States
            </div>

            {/* Mexico Region Label */}
            <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-lg md:text-xl font-bold text-green-300">
              🇲🇽 Mexico
            </div>

            {/* City Markers - Enhanced for Mobile */}
            {getAllCities().map(city => {
              const isCurrentLocation = city.name === character.location
              const canAfford = character.cash >= city.travelCost && character.stamina >= city.staminaCost
              
              return (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  disabled={isCurrentLocation}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 touch-manipulation ${
                    isCurrentLocation
                      ? 'text-muted-gold scale-125 cursor-default'
                      : canAfford
                      ? 'text-pale-white hover:text-muted-gold hover:scale-110 cursor-pointer active:scale-95'
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                  style={{
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`
                  }}
                  title={`${city.name} - $${city.travelCost} / ${city.staminaCost} stamina`}
                  aria-label={`Travel to ${city.name}. Cost: $${city.travelCost}, Stamina: ${city.staminaCost}`}
                >
                  <div className="text-center p-2">
                    <div className={`text-2xl md:text-3xl mb-1 ${isCurrentLocation ? 'animate-pulse' : ''}`}>
                      {isCurrentLocation ? '📍' : '🏙️'}
                    </div>
                    <div className="text-xs font-bold bg-black bg-opacity-75 px-2 py-1 rounded whitespace-nowrap">
                      {city.name}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* City Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllCities().map(city => {
            const isCurrentLocation = city.name === character.location
            const canAfford = character.cash >= city.travelCost && character.stamina >= city.staminaCost
            
            return (
              <div
                key={city.id}
                className={`card transition-all duration-300 ${
                  isCurrentLocation
                    ? 'border-muted-gold bg-gradient-to-br from-deep-gray to-yellow-900'
                    : canAfford
                    ? 'hover:border-muted-gold cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => !isCurrentLocation && handleCityClick(city)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-lg font-bold ${isCurrentLocation ? 'text-muted-gold' : 'text-pale-white'}`}>
                    {city.name}
                  </h3>
                  <span className="text-sm text-gray-400">{city.country}</span>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                  {city.description}
                </p>

                {!isCurrentLocation && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Travel Cost:</span>
                      <span className={character.cash >= city.travelCost ? 'text-green-400' : 'text-red-400'}>
                        ${city.travelCost}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stamina Cost:</span>
                      <span className={character.stamina >= city.staminaCost ? 'text-blue-400' : 'text-red-400'}>
                        {city.staminaCost}
                      </span>
                    </div>
                  </div>
                )}

                {isCurrentLocation && (
                  <div className="text-center py-2">
                    <span className="text-muted-gold font-bold">📍 Current Location</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Travel Confirmation Modal - Mobile Optimized */}
        {showConfirmation && selectedCity && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-muted-gold">
                Confirm Travel
              </h2>

              <div className="text-center mb-6">
                <p className="text-base md:text-lg mb-2">
                  Travel to <span className="text-muted-gold font-bold">{selectedCity.name}</span>?
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {selectedCity.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="bg-deep-gray bg-opacity-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Travel Cost:</span>
                      <span className="text-red-400 font-bold">-${selectedCity.travelCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Stamina Cost:</span>
                      <span className="text-blue-400 font-bold">-{selectedCity.staminaCost}</span>
                    </div>
                  </div>
                  
                  <div className="bg-deep-gray bg-opacity-50 p-3 rounded-lg border border-muted-gold">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Remaining Cash:</span>
                      <span className="text-green-400 font-bold">
                        ${(character.cash - selectedCity.travelCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Remaining Stamina:</span>
                      <span className="text-blue-400 font-bold">
                        {Math.max(0, character.stamina - selectedCity.staminaCost)}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false)
                    setSelectedCity(null)
                  }}
                  className="btn-secondary flex-1 py-3"
                  disabled={isTraveling}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTravel}
                  className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isTraveling}
                >
                  {isTraveling ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Traveling...
                    </span>
                  ) : (
                    'Confirm Travel'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TravelMap