/**
 * TravelMap Component
 * Interactive map for traveling between cities in Mexico and USA
 * 
 * Features:
 * - Visual map with clickable city locations
 * - Travel cost and stamina requirements
 * - Travel confirmation modal
 * - Real-time updates to character location
 * - Different regions (Mexico vs USA)
 */

import React, { useState } from 'react'

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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            Travel Map
          </h1>
          <p className="text-gray-400 text-lg">
            Current Location: <span className="text-muted-gold">{character.location}</span>
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span>💰 Cash: <span className="text-green-400">${character.cash.toLocaleString()}</span></span>
            <span>⚡ Stamina: <span className="text-blue-400">{character.stamina}/100</span></span>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-muted-gold mb-6 text-center">
            North America
          </h2>
          
          <div className="relative bg-gradient-to-b from-blue-900 to-green-900 rounded-lg p-8 min-h-[500px] overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg"></div>
            </div>

            {/* USA Region Label */}
            <div className="absolute top-4 left-4 text-xl font-bold text-blue-300">
              🇺🇸 United States
            </div>

            {/* Mexico Region Label */}
            <div className="absolute bottom-4 left-4 text-xl font-bold text-green-300">
              🇲🇽 Mexico
            </div>

            {/* City Markers */}
            {getAllCities().map(city => {
              const isCurrentLocation = city.name === character.location
              const canAfford = character.cash >= city.travelCost && character.stamina >= city.staminaCost
              
              return (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  disabled={isCurrentLocation}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isCurrentLocation
                      ? 'text-muted-gold scale-125 cursor-default'
                      : canAfford
                      ? 'text-pale-white hover:text-muted-gold hover:scale-110 cursor-pointer'
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                  style={{
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`
                  }}
                  title={`${city.name} - $${city.travelCost} / ${city.staminaCost} stamina`}
                >
                  <div className="text-center">
                    <div className={`text-3xl mb-1 ${isCurrentLocation ? 'animate-pulse' : ''}`}>
                      {isCurrentLocation ? '📍' : '🏙️'}
                    </div>
                    <div className="text-xs font-bold bg-black bg-opacity-75 px-2 py-1 rounded">
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

        {/* Travel Confirmation Modal */}
        {showConfirmation && selectedCity && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-muted-gold">
                Confirm Travel
              </h2>

              <div className="text-center mb-6">
                <p className="text-lg mb-2">
                  Travel to <span className="text-muted-gold font-bold">{selectedCity.name}</span>?
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {selectedCity.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="text-red-400">-${selectedCity.travelCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamina:</span>
                    <span className="text-blue-400">-{selectedCity.staminaCost}</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between font-bold">
                    <span>Remaining Cash:</span>
                    <span className="text-green-400">
                      ${(character.cash - selectedCity.travelCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Remaining Stamina:</span>
                    <span className="text-blue-400">
                      {Math.max(0, character.stamina - selectedCity.staminaCost)}/100
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false)
                    setSelectedCity(null)
                  }}
                  className="btn-secondary flex-1"
                  disabled={isTraveling}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTravel}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isTraveling}
                >
                  {isTraveling ? 'Traveling...' : 'Travel'}
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