/**
 * Missions Component
 * Displays available missions and handles mission completion logic
 * 
 * Features:
 * - Mission list with difficulty indicators
 * - Skill-based success probability calculation
 * - Mission completion with rewards (cash + XP)
 * - Mission failure consequences
 * - Location-based mission filtering
 */

import React, { useState, useEffect } from 'react'

const Missions = ({ character, onCharacterUpdate }) => {
  const [availableMissions, setAvailableMissions] = useState([])
  const [selectedMission, setSelectedMission] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isAttempting, setIsAttempting] = useState(false)
  const [missionResult, setMissionResult] = useState(null)
  const [filterDifficulty, setFilterDifficulty] = useState('all')

  // Mission database with varying difficulties and requirements
  const missionDatabase = [
    {
      id: 'delivery-1',
      title: 'Package Delivery',
      description: 'Deliver a mysterious package across town. No questions asked.',
      difficulty: 'Easy',
      location: 'Any',
      requirements: { strength: 1, intelligence: 1, endurance: 2, shooting: 1 },
      rewards: { cash: 500, xp: 50 },
      failureConsequences: { health: -10, cash: -100 },
      successRate: 0.8
    },
    {
      id: 'intimidation-1',
      title: 'Debt Collection',
      description: 'Convince a debtor to pay up. Use whatever methods necessary.',
      difficulty: 'Easy',
      location: 'Any',
      requirements: { strength: 3, intelligence: 1, endurance: 1, shooting: 1 },
      rewards: { cash: 750, xp: 75 },
      failureConsequences: { health: -15, stamina: -20 },
      successRate: 0.7
    },
    {
      id: 'smuggling-1',
      title: 'Border Run',
      description: 'Transport goods across the border without detection.',
      difficulty: 'Medium',
      location: 'Tijuana',
      requirements: { strength: 2, intelligence: 4, endurance: 3, shooting: 2 },
      rewards: { cash: 1200, xp: 120 },
      failureConsequences: { health: -25, cash: -300 },
      successRate: 0.6
    },
    {
      id: 'heist-1',
      title: 'Jewelry Store Job',
      description: 'Quick in and out. Grab the diamonds and disappear.',
      difficulty: 'Hard',
      location: 'Los Angeles',
      requirements: { strength: 3, intelligence: 5, endurance: 4, shooting: 6 },
      rewards: { cash: 2500, xp: 250 },
      failureConsequences: { health: -40, stamina: -30, cash: -500 },
      successRate: 0.4
    },
    {
      id: 'assassination-1',
      title: 'Eliminate Target',
      description: 'Take out a rival gang member. Clean and professional.',
      difficulty: 'Hard',
      location: 'Miami',
      requirements: { strength: 4, intelligence: 6, endurance: 3, shooting: 8 },
      rewards: { cash: 3000, xp: 300 },
      failureConsequences: { health: -50, stamina: -40, cash: -750 },
      successRate: 0.3
    },
    {
      id: 'drug-lab-1',
      title: 'Lab Protection',
      description: 'Guard a drug lab from police raids. Stay alert.',
      difficulty: 'Medium',
      location: 'Juarez',
      requirements: { strength: 4, intelligence: 2, endurance: 5, shooting: 4 },
      rewards: { cash: 1500, xp: 150 },
      failureConsequences: { health: -30, stamina: -25 },
      successRate: 0.5
    },
    {
      id: 'money-laundering-1',
      title: 'Clean the Books',
      description: 'Help launder money through legitimate businesses.',
      difficulty: 'Medium',
      location: 'New York',
      requirements: { strength: 1, intelligence: 7, endurance: 2, shooting: 1 },
      rewards: { cash: 1800, xp: 180 },
      failureConsequences: { health: -20, cash: -400 },
      successRate: 0.6
    },
    {
      id: 'cartel-meeting-1',
      title: 'Cartel Negotiation',
      description: 'Represent your organization in high-stakes negotiations.',
      difficulty: 'Hard',
      location: 'Puerto Vallarta',
      requirements: { strength: 5, intelligence: 8, endurance: 4, shooting: 5 },
      rewards: { cash: 4000, xp: 400 },
      failureConsequences: { health: -60, stamina: -50, cash: -1000 },
      successRate: 0.25
    },
    {
      id: 'street-racing-1',
      title: 'Underground Race',
      description: 'Win an illegal street race with high stakes.',
      difficulty: 'Easy',
      location: 'Los Angeles',
      requirements: { strength: 2, intelligence: 3, endurance: 4, shooting: 1 },
      rewards: { cash: 800, xp: 80 },
      failureConsequences: { health: -20, stamina: -15 },
      successRate: 0.7
    },
    {
      id: 'information-1',
      title: 'Intel Gathering',
      description: 'Infiltrate a rival organization and gather intelligence.',
      difficulty: 'Medium',
      location: 'Any',
      requirements: { strength: 2, intelligence: 6, endurance: 3, shooting: 2 },
      rewards: { cash: 1000, xp: 100 },
      failureConsequences: { health: -25, stamina: -20 },
      successRate: 0.6
    }
  ]

  /**
   * Load available missions on component mount
   */
  useEffect(() => {
    loadAvailableMissions()
  }, [character])

  /**
   * Filters missions based on location and completion status
   */
  const loadAvailableMissions = () => {
    const completedMissionIds = character.completedMissions || []
    
    const filtered = missionDatabase.filter(mission => {
      // Filter out completed missions
      if (completedMissionIds.includes(mission.id)) {
        return false
      }
      
      // Filter by location (Any location missions are always available)
      if (mission.location !== 'Any' && mission.location !== character.location) {
        return false
      }
      
      return true
    })
    
    setAvailableMissions(filtered)
  }

  /**
   * Calculates success probability based on character skills vs mission requirements
   */
  const calculateSuccessRate = (mission) => {
    const { requirements } = mission
    const { skills } = character
    
    let totalRequirement = 0
    let totalSkill = 0
    
    Object.keys(requirements).forEach(skill => {
      totalRequirement += requirements[skill]
      totalSkill += skills[skill] || 1
    })
    
    // Base success rate from mission + skill bonus/penalty
    const skillRatio = totalSkill / totalRequirement
    const adjustedRate = mission.successRate * Math.min(skillRatio, 2) // Cap at 2x base rate
    
    return Math.min(Math.max(adjustedRate, 0.1), 0.95) // Min 10%, max 95%
  }

  /**
   * Gets difficulty color for UI display
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'Hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  /**
   * Checks if character meets minimum requirements for mission
   */
  const meetsRequirements = (mission) => {
    const { requirements } = mission
    const { skills } = character
    
    return Object.keys(requirements).every(skill => {
      return (skills[skill] || 1) >= requirements[skill]
    })
  }

  /**
   * Handles mission selection
   */
  const handleMissionSelect = (mission) => {
    setSelectedMission(mission)
    setShowConfirmation(true)
    setMissionResult(null)
  }

  /**
   * Attempts to complete the selected mission
   */
  const attemptMission = async () => {
    if (!selectedMission) return

    setIsAttempting(true)

    try {
      // Calculate success probability
      const successRate = calculateSuccessRate(selectedMission)
      const randomRoll = Math.random()
      const isSuccess = randomRoll <= successRate

      let updatedCharacter = { ...character }
      let resultMessage = ''

      if (isSuccess) {
        // Mission Success
        updatedCharacter.cash += selectedMission.rewards.cash
        updatedCharacter.xp += selectedMission.rewards.xp
        updatedCharacter.completedMissions = [...(character.completedMissions || []), selectedMission.id]
        
        resultMessage = `Mission completed successfully! Earned $${selectedMission.rewards.cash} and ${selectedMission.rewards.xp} XP.`
        
        // Add to activity log
        const activity = {
          id: Date.now(),
          type: 'mission_completed',
          message: `Completed mission: ${selectedMission.title}`,
          timestamp: new Date().toISOString()
        }
        
        const savedActivity = localStorage.getItem(`activity_${character.id}`) || '[]'
        const activityList = JSON.parse(savedActivity)
        activityList.unshift(activity)
        localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 50)))
      } else {
        // Mission Failure
        const consequences = selectedMission.failureConsequences
        
        if (consequences.health) {
          updatedCharacter.health = Math.max(0, updatedCharacter.health + consequences.health)
        }
        if (consequences.stamina) {
          updatedCharacter.stamina = Math.max(0, updatedCharacter.stamina + consequences.stamina)
        }
        if (consequences.cash) {
          updatedCharacter.cash = Math.max(0, updatedCharacter.cash + consequences.cash)
        }
        
        resultMessage = `Mission failed! Lost ${Math.abs(consequences.health || 0)} health, ${Math.abs(consequences.stamina || 0)} stamina, and $${Math.abs(consequences.cash || 0)}.`
      }

      // Update character
      onCharacterUpdate(updatedCharacter)
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Show result
      setMissionResult({
        success: isSuccess,
        message: resultMessage,
        mission: selectedMission
      })

      // Reload available missions
      setTimeout(() => {
        loadAvailableMissions()
      }, 1000)

    } catch (error) {
      console.error('Mission attempt error:', error)
      setMissionResult({
        success: false,
        message: 'Mission attempt failed due to an error. Please try again.',
        mission: selectedMission
      })
    } finally {
      setIsAttempting(false)
    }
  }

  /**
   * Filters missions by difficulty
   */
  const getFilteredMissions = () => {
    if (filterDifficulty === 'all') {
      return availableMissions
    }
    return availableMissions.filter(mission => mission.difficulty === filterDifficulty)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            Available Missions
          </h1>
          <p className="text-gray-400 text-lg">
            Complete jobs to earn cash and experience
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span>📍 Location: <span className="text-muted-gold">{character.location}</span></span>
            <span>💰 Cash: <span className="text-green-400">${character.cash.toLocaleString()}</span></span>
            <span>❤️ Health: <span className="text-red-400">{character.health}/100</span></span>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-muted-gold">Filter by Difficulty</h2>
            <div className="flex space-x-2">
              {['all', 'Easy', 'Medium', 'Hard'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setFilterDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterDifficulty === difficulty
                      ? 'bg-muted-gold text-charcoal'
                      : 'bg-deep-gray text-pale-white hover:bg-gray-600'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredMissions().length > 0 ? (
            getFilteredMissions().map(mission => {
              const successRate = calculateSuccessRate(mission)
              const canAttempt = meetsRequirements(mission)
              
              return (
                <div
                  key={mission.id}
                  className={`mission-card ${canAttempt ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                  onClick={() => canAttempt && handleMissionSelect(mission)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-pale-white">
                      {mission.title}
                    </h3>
                    <span className={`text-sm font-bold ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4">
                    {mission.description}
                  </p>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Requirements</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(mission.requirements).map(([skill, required]) => {
                        const playerSkill = character.skills[skill] || 1
                        const meets = playerSkill >= required
                        
                        return (
                          <div key={skill} className={`flex justify-between ${meets ? 'text-green-400' : 'text-red-400'}`}>
                            <span>{skill.toUpperCase()}:</span>
                            <span>{required} ({playerSkill})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Rewards</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">${mission.rewards.cash}</span>
                      <span className="text-blue-400">{mission.rewards.xp} XP</span>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold text-muted-gold">
                        {Math.round(successRate * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${successRate * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="text-xs text-gray-400 mb-3">
                    📍 {mission.location}
                  </div>

                  {!canAttempt && (
                    <div className="text-center py-2">
                      <span className="text-red-400 text-sm font-bold">
                        Insufficient Skills
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl text-gray-600 mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Missions Available</h3>
              <p className="text-gray-500">
                {filterDifficulty === 'all' 
                  ? 'All missions completed or travel to other locations for more opportunities.'
                  : `No ${filterDifficulty} missions available. Try a different difficulty or location.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Mission Confirmation Modal */}
        {showConfirmation && selectedMission && !missionResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-muted-gold">
                Confirm Mission
              </h2>

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">{selectedMission.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {selectedMission.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="text-muted-gold font-bold">
                      {Math.round(calculateSuccessRate(selectedMission) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Reward:</span>
                    <span className="text-green-400">
                      ${selectedMission.rewards.cash} + {selectedMission.rewards.xp} XP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failure Risk:</span>
                    <span className="text-red-400">
                      -{Math.abs(selectedMission.failureConsequences.health || 0)} HP, 
                      ${Math.abs(selectedMission.failureConsequences.cash || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false)
                    setSelectedMission(null)
                  }}
                  className="btn-secondary flex-1"
                  disabled={isAttempting}
                >
                  Cancel
                </button>
                <button
                  onClick={attemptMission}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAttempting}
                >
                  {isAttempting ? 'Attempting...' : 'Attempt Mission'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mission Result Modal */}
        {missionResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className={`text-2xl font-bold text-center mb-4 ${
                missionResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {missionResult.success ? '✅ Mission Success!' : '❌ Mission Failed!'}
              </h2>

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">{missionResult.mission.title}</h3>
                <p className="text-sm text-gray-300">
                  {missionResult.message}
                </p>
              </div>

              <button
                onClick={() => {
                  setMissionResult(null)
                  setShowConfirmation(false)
                  setSelectedMission(null)
                }}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Missions