/**
 * HUD (Heads-Up Display) Component
 * Persistent UI element showing player stats and navigation
 * 
 * Features:
 * - Real-time display of character stats (health, stamina, cash, XP, level)
 * - Current location indicator
 * - Quick navigation menu
 * - Logout functionality
 * - Responsive design that stays fixed at top of screen
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const HUD = ({ character, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()

  /**
   * Formats large numbers for display (e.g., 1000 -> 1K)
   */
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  /**
   * Calculates level based on XP
   */
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1
  }

  /**
   * Calculates XP needed for next level
   */
  const getXPForNextLevel = (xp) => {
    const currentLevel = calculateLevel(xp)
    const xpForNextLevel = currentLevel * 100
    return xpForNextLevel - xp
  }

  /**
   * Gets health bar color based on health percentage
   */
  const getHealthColor = (health) => {
    if (health >= 70) return 'bg-green-500'
    if (health >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  /**
   * Gets stamina bar color based on stamina percentage
   */
  const getStaminaColor = (stamina) => {
    if (stamina >= 50) return 'bg-blue-500'
    if (stamina >= 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!character) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-deep-gray bg-opacity-95 border-b border-muted-gold backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section - Character Info */}
          <div className="flex items-center space-x-6">
            {/* Character Name & Level */}
            <div className="text-left">
              <h3 className="text-lg font-bold text-muted-gold">
                {character.name}
              </h3>
              <p className="text-sm text-gray-400">
                Level {calculateLevel(character.xp)} • {character.location}
              </p>
            </div>

            {/* Health Bar */}
            <div className="hud-stat">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">HP</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getHealthColor(character.health)} transition-all duration-300`}
                    style={{ width: `${character.health}%` }}
                  />
                </div>
                <span className="text-xs">{character.health}/100</span>
              </div>
            </div>

            {/* Stamina Bar */}
            <div className="hud-stat">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">STA</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStaminaColor(character.stamina)} transition-all duration-300`}
                    style={{ width: `${character.stamina}%` }}
                  />
                </div>
                <span className="text-xs">{character.stamina}/100</span>
              </div>
            </div>
          </div>

          {/* Center Section - Cash & XP */}
          <div className="flex items-center space-x-6">
            {/* Cash */}
            <div className="hud-stat">
              <div className="flex items-center space-x-2">
                <span className="text-muted-gold">💰</span>
                <span className="font-bold text-green-400">
                  ${formatNumber(character.cash)}
                </span>
              </div>
            </div>

            {/* XP */}
            <div className="hud-stat">
              <div className="flex items-center space-x-2">
                <span className="text-muted-gold">⭐</span>
                <span className="font-bold text-blue-400">
                  {formatNumber(character.xp)} XP
                </span>
                <span className="text-xs text-gray-400">
                  ({getXPForNextLevel(character.xp)} to next)
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Navigation Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Menu ▼
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-deep-gray border border-muted-gold rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <Link
                    to="/menu"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/menu' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    🏠 Main Menu
                  </Link>
                  <Link
                    to="/travel"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/travel' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    🗺️ Travel Map
                  </Link>
                  <Link
                    to="/missions"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/missions' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    📋 Missions
                  </Link>
                  <Link
                    to="/streets"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/streets' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    🏪 Streets
                  </Link>
                  <Link
                    to="/inventory"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/inventory' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    🎒 Inventory
                  </Link>
                  <Link
                    to="/skills"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/skills' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    🌟 Skills
                  </Link>
                  <Link
                    to="/characters"
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === '/characters' ? 'text-muted-gold' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    👤 Characters
                  </Link>
                  <hr className="my-2 border-gray-600" />
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onLogout()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

export default HUD