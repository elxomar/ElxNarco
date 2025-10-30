/**
 * MainMenu Component - Game Hub
 * Central dashboard showing player stats and navigation to all game features
 * 
 * Features:
 * - Character overview with detailed stats
 * - Navigation buttons to all game sections
 * - Recent activity feed
 * - Quick stats display
 * - Responsive grid layout inspired by GTA V loading screens
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MainMenu = ({ character }) => {
  const [recentActivity, setRecentActivity] = useState([])
  const [timeOfDay, setTimeOfDay] = useState('')

  /**
   * Initialize component data on mount
   */
  useEffect(() => {
    loadRecentActivity()
    updateTimeOfDay()
    
    // Update time every minute
    const timeInterval = setInterval(updateTimeOfDay, 60000)
    return () => clearInterval(timeInterval)
  }, [])

  /**
   * Loads recent player activity from localStorage or API
   */
  const loadRecentActivity = () => {
    // TODO: Replace with actual API call
    const savedActivity = localStorage.getItem(`activity_${character.id}`)
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity))
    } else {
      // Default activity for new characters
      setRecentActivity([
        { id: 1, type: 'character_created', message: 'Character created', timestamp: new Date().toISOString() },
        { id: 2, type: 'location_arrived', message: `Arrived in ${character.location}`, timestamp: new Date().toISOString() }
      ])
    }
  }

  /**
   * Updates time of day display
   */
  const updateTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('Morning')
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('Afternoon')
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('Evening')
    } else {
      setTimeOfDay('Night')
    }
  }

  /**
   * Calculates character level based on XP
   */
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1
  }

  /**
   * Calculates XP progress to next level
   */
  const getXPProgress = (xp) => {
    const currentLevel = calculateLevel(xp)
    const xpForCurrentLevel = (currentLevel - 1) * 100
    const xpForNextLevel = currentLevel * 100
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    return Math.min(progress, 100)
  }

  /**
   * Gets total skill points
   */
  const getTotalSkillPoints = () => {
    return Object.values(character.skills).reduce((total, skill) => total + skill, 0)
  }

  /**
   * Formats timestamp for display
   */
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  /**
   * Gets activity icon based on type
   */
  const getActivityIcon = (type) => {
    switch (type) {
      case 'mission_completed': return '✅'
      case 'item_purchased': return '🛒'
      case 'item_sold': return '💰'
      case 'location_arrived': return '📍'
      case 'skill_upgraded': return '⭐'
      case 'character_created': return '👤'
      default: return '📝'
    }
  }

  // Navigation menu items
  const menuItems = [
    {
      title: 'Travel Map',
      description: 'Explore cities and regions',
      icon: '🗺️',
      path: '/travel',
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Missions',
      description: 'Complete jobs for cash and XP',
      icon: '📋',
      path: '/missions',
      color: 'from-green-600 to-green-800'
    },
    {
      title: 'Streets',
      description: 'Trade with NPCs and dealers',
      icon: '🏪',
      path: '/streets',
      color: 'from-purple-600 to-purple-800'
    },
    {
      title: 'Inventory',
      description: 'Manage your items and drugs',
      icon: '🎒',
      path: '/inventory',
      color: 'from-orange-600 to-orange-800'
    },
    {
      title: 'Skill Tree',
      description: 'Upgrade your abilities',
      icon: '🌟',
      path: '/skills',
      color: 'from-yellow-600 to-yellow-800'
    },
    {
      title: 'Characters',
      description: 'Switch between characters',
      icon: '👤',
      path: '/characters',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            Welcome Back, {character.name}
          </h1>
          <p className="text-gray-400 text-lg">
            {timeOfDay} in {character.location}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Character Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Character Overview */}
            <div className="card">
              <h2 className="text-xl font-bold text-muted-gold mb-4">Character Overview</h2>
              
              <div className="space-y-4">
                {/* Level and XP */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Level {calculateLevel(character.xp)}</span>
                    <span className="text-sm text-gray-400">{character.xp} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-muted-gold to-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getXPProgress(character.xp)}%` }}
                    />
                  </div>
                </div>

                {/* Health */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Health</span>
                    <span className="text-sm text-gray-400">{character.health}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${character.health}%` }}
                    />
                  </div>
                </div>

                {/* Stamina */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Stamina</span>
                    <span className="text-sm text-gray-400">{character.stamina}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${character.stamina}%` }}
                    />
                  </div>
                </div>

                {/* Cash */}
                <div className="flex justify-between items-center p-3 bg-deep-gray rounded-lg">
                  <span className="text-sm font-medium">Cash</span>
                  <span className="text-lg font-bold text-green-400">${character.cash.toLocaleString()}</span>
                </div>

                {/* Total Skill Points */}
                <div className="flex justify-between items-center p-3 bg-deep-gray rounded-lg">
                  <span className="text-sm font-medium">Total Skills</span>
                  <span className="text-lg font-bold text-blue-400">{getTotalSkillPoints()}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-bold text-muted-gold mb-4">Recent Activity</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 10).map(activity => (
                    <div key={activity.id} className="flex items-center space-x-3 p-2 bg-deep-gray rounded-lg">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-pale-white">{activity.message}</p>
                        <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Navigation Menu */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-muted-gold mb-6 text-center">Game Menu</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-deep-gray to-gray-800 border border-gray-600 hover:border-muted-gold transition-all duration-300 transform hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    
                    <div className="relative p-6 text-center">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h3 className="text-xl font-bold text-pale-white mb-2 group-hover:text-muted-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <h3 className="font-bold text-muted-gold mb-2">Missions Available</h3>
                <p className="text-2xl font-bold text-green-400">5</p>
                <p className="text-xs text-gray-400">Ready to complete</p>
              </div>
              
              <div className="card text-center">
                <h3 className="font-bold text-muted-gold mb-2">Items in Inventory</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {character.inventory?.items?.length || 0}
                </p>
                <p className="text-xs text-gray-400">Items owned</p>
              </div>
              
              <div className="card text-center">
                <h3 className="font-bold text-muted-gold mb-2">Current Location</h3>
                <p className="text-lg font-bold text-purple-400">{character.location}</p>
                <p className="text-xs text-gray-400">Travel to explore</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMenu