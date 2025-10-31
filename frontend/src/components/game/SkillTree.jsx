/**
 * SkillTree Component
 * Manages character skill progression and XP spending
 * 
 * Features:
 * - Display all four skills: Strength, Intelligence, Endurance, Shooting
 * - Show current skill levels and XP costs for upgrades
 * - Allow spending XP to improve skills
 * - Visual skill progression with level caps
 * - Skill descriptions and benefits
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SkillTree = ({ character, onCharacterUpdate }) => {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState(null)

  // Skill definitions with descriptions and benefits
  const skillDefinitions = {
    strength: {
      name: 'Strength',
      description: 'Physical power and combat effectiveness',
      icon: '💪',
      benefits: [
        'Increases mission success rate for physical tasks',
        'Reduces stamina cost for travel',
        'Improves intimidation in negotiations',
        'Unlocks strength-based missions'
      ]
    },
    intelligence: {
      name: 'Intelligence',
      description: 'Mental acuity and strategic thinking',
      icon: '🧠',
      benefits: [
        'Increases mission success rate for planning tasks',
        'Better prices when trading with NPCs',
        'Unlocks complex heist missions',
        'Improves hacking and tech-based activities'
      ]
    },
    endurance: {
      name: 'Endurance',
      description: 'Stamina and resilience',
      icon: '🏃',
      benefits: [
        'Increases maximum stamina',
        'Faster stamina regeneration',
        'Survive dangerous missions better',
        'Reduced travel fatigue'
      ]
    },
    shooting: {
      name: 'Shooting',
      description: 'Firearms proficiency and accuracy',
      icon: '🎯',
      benefits: [
        'Increases mission success rate for combat',
        'Unlocks weapon-based missions',
        'Better performance in shootouts',
        'Access to advanced weaponry'
      ]
    }
  }

  /**
   * Calculates XP cost for next skill level
   * Cost increases exponentially with level
   */
  const getUpgradeCost = (currentLevel) => {
    return Math.floor(100 * Math.pow(1.5, currentLevel))
  }

  /**
   * Handles skill upgrade
   * Deducts XP and increases skill level
   */
  const upgradeSkill = async (skillName) => {
    const currentLevel = character.skills[skillName]
    const cost = getUpgradeCost(currentLevel)

    // Validation
    if (character.xp < cost) {
      alert('Not enough XP to upgrade this skill!')
      return
    }

    if (currentLevel >= 20) {
      alert('This skill is already at maximum level!')
      return
    }

    setIsUpgrading(true)

    try {
      // Create updated character with new skill level and reduced XP
      const updatedCharacter = {
        ...character,
        xp: character.xp - cost,
        skills: {
          ...character.skills,
          [skillName]: currentLevel + 1
        }
      }

      // Update character in parent component
      onCharacterUpdate(updatedCharacter)

      // Save to localStorage
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Update characters list
      const savedCharacters = localStorage.getItem(`characters_${character.userId}`)
      if (savedCharacters) {
        const characters = JSON.parse(savedCharacters)
        const updatedCharacters = characters.map(char => 
          char.id === character.id ? updatedCharacter : char
        )
        localStorage.setItem(`characters_${character.userId}`, JSON.stringify(updatedCharacters))
      }

      // Add activity log
      const activity = {
        id: Date.now(),
        type: 'skill_upgraded',
        message: `Upgraded ${skillDefinitions[skillName].name} to level ${currentLevel + 1}`,
        timestamp: new Date().toISOString()
      }

      const savedActivity = localStorage.getItem(`activity_${character.id}`)
      const activityList = savedActivity ? JSON.parse(savedActivity) : []
      activityList.unshift(activity)
      localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 10)))

    } catch (error) {
      console.error('Error upgrading skill:', error)
      alert('Failed to upgrade skill. Please try again.')
    } finally {
      setIsUpgrading(false)
    }
  }

  /**
   * Gets skill level color based on progression
   */
  const getSkillColor = (level) => {
    if (level >= 15) return 'text-muted-gold'
    if (level >= 10) return 'text-orange-400'
    if (level >= 5) return 'text-blue-400'
    return 'text-gray-400'
  }

  /**
   * Gets skill progress bar width
   */
  const getProgressWidth = (level) => {
    return Math.min((level / 20) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-charcoal p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
              Skill Tree
            </h1>
            <p className="text-gray-400 text-lg">
              Develop your criminal expertise
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-muted-gold">
              {character.xp.toLocaleString()} XP
            </div>
            <div className="text-sm text-gray-400">Available Experience</div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(skillDefinitions).map(([skillKey, skill]) => {
            const currentLevel = character.skills[skillKey]
            const upgradeCost = getUpgradeCost(currentLevel)
            const canUpgrade = character.xp >= upgradeCost && currentLevel < 20

            return (
              <div key={skillKey} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{skill.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-pale-white">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getSkillColor(currentLevel)}`}>
                      {currentLevel}
                    </div>
                    <div className="text-xs text-gray-500">Level</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{currentLevel}/20</span>
                  </div>
                  <div className="w-full bg-deep-gray rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-muted-gold to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressWidth(currentLevel)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Upgrade Section */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {currentLevel < 20 ? (
                      <div className="text-sm text-gray-400">
                        Next level: <span className="text-muted-gold font-semibold">
                          {upgradeCost.toLocaleString()} XP
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-gold font-semibold">
                        MAX LEVEL
                      </div>
                    )}
                  </div>
                  {currentLevel < 20 && (
                    <button
                      onClick={() => upgradeSkill(skillKey)}
                      disabled={!canUpgrade || isUpgrading}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        canUpgrade
                          ? 'btn-primary hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isUpgrading ? 'Upgrading...' : 'Upgrade'}
                    </button>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <button
                    onClick={() => setSelectedSkill(selectedSkill === skillKey ? null : skillKey)}
                    className="text-sm text-muted-gold hover:text-yellow-400 transition-colors"
                  >
                    {selectedSkill === skillKey ? 'Hide Benefits' : 'Show Benefits'}
                  </button>
                  
                  {selectedSkill === skillKey && (
                    <div className="mt-3 space-y-1">
                      {skill.benefits.map((benefit, index) => (
                        <div key={index} className="text-sm text-gray-300 flex items-start">
                          <span className="text-muted-gold mr-2">•</span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Character Stats Summary */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-pale-white mb-4">Character Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-gold">
                {character.level}
              </div>
              <div className="text-sm text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                ${character.cash.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Cash</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {character.stamina}/{character.maxStamina}
              </div>
              <div className="text-sm text-gray-400">Stamina</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {character.health}/100
              </div>
              <div className="text-sm text-gray-400">Health</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/menu" className="btn-secondary">
            Back to Menu
          </Link>
          <Link to="/missions" className="btn-primary">
            View Missions
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SkillTree