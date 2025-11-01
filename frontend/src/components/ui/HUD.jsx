/**
 * HUD (Heads-Up Display) Component - Mobile-First Responsive Design
 * Professional-grade persistent UI element for player stats and navigation
 * 
 * Features:
 * - Mobile-first responsive design with collapsible navigation
 * - Real-time display of character stats (health, stamina, cash, XP, level)
 * - Touch-friendly hamburger menu for mobile devices
 * - Desktop-optimized horizontal layout for larger screens
 * - Smooth animations and professional visual polish
 * - Accessibility support with proper ARIA labels
 * 
 * Mobile Design (< 768px):
 * - Compact single-row layout with essential stats
 * - Hamburger menu for navigation
 * - Optimized for thumb navigation
 * 
 * Desktop Design (>= 768px):
 * - Full horizontal layout with all stats visible
 * - Dropdown navigation menu
 * - Enhanced visual hierarchy
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const HUD = ({ character, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  /**
   * Detect mobile screen size and update state
   * Ensures proper responsive behavior
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /**
   * Close menu when clicking outside or navigating
   */
  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname])

  /**
   * Formats large numbers for display (e.g., 1000 -> 1K)
   * Optimized for mobile screen space
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
   * Calculates level based on XP using game formula
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
   * Professional color coding for game UI
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

  /**
   * Navigation menu items configuration
   * Centralized for easy maintenance
   */
  const navigationItems = [
    { path: '/menu', label: 'Main Menu', icon: '🏠' },
    { path: '/travel', label: 'Travel Map', icon: '🗺️' },
    { path: '/missions', label: 'Missions', icon: '📋' },
    { path: '/streets', label: 'Streets', icon: '🏪' },
    { path: '/inventory', label: 'Inventory', icon: '🎒' },
    { path: '/skills', label: 'Skills', icon: '🌟' },
    { path: '/characters', label: 'Characters', icon: '👤' }
  ]

  if (!character) return null

  return (
    <>
      {/* Main HUD Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-deep-gray bg-opacity-95 border-b border-muted-gold backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-3 py-2">
          
          {/* Mobile Layout (< 768px) */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Left: Character Name & Level */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-muted-gold truncate">
                  {character.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  Lv.{calculateLevel(character.xp)} • {character.location}
                </p>
              </div>

              {/* Center: Essential Stats */}
              <div className="flex items-center space-x-3 mx-3">
                {/* Cash */}
                <div className="flex items-center space-x-1">
                  <span className="text-sm">💰</span>
                  <span className="text-xs font-bold text-green-400">
                    ${formatNumber(character.cash)}
                  </span>
                </div>

                {/* Health */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-red-400">❤️</span>
                  <span className="text-xs font-medium">{character.health}</span>
                </div>

                {/* Stamina */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-400">⚡</span>
                  <span className="text-xs font-medium">{character.stamina}</span>
                </div>
              </div>

              {/* Right: Hamburger Menu */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-deep-gray border border-muted-gold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-muted-gold focus:ring-opacity-50"
                aria-label="Open navigation menu"
                aria-expanded={showMenu}
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <div className={`w-full h-0.5 bg-muted-gold transition-transform duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-muted-gold transition-opacity duration-300 ${showMenu ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-muted-gold transition-transform duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Layout (>= 768px) */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left Section - Character Info & Stats */}
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
                className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2"
                aria-label="Open navigation menu"
                aria-expanded={showMenu}
              >
                <span>Menu</span>
                <span className={`transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Overlay */}
      {showMenu && (
        <>
          {/* Mobile Menu - Full Screen Overlay */}
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-muted-gold">
                  <h2 className="text-xl font-bold text-muted-gold">Navigation</h2>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <span className="text-2xl text-muted-gold">×</span>
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                          location.pathname === item.path 
                            ? 'bg-muted-gold bg-opacity-20 text-muted-gold border border-muted-gold' 
                            : 'text-pale-white hover:bg-gray-700 hover:text-muted-gold'
                        }`}
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-600">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onLogout()
                    }}
                    className="w-full flex items-center justify-center space-x-3 p-4 rounded-lg bg-red-600 hover:bg-red-700 text-pale-white font-medium transition-colors"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Menu - Dropdown */
            <div className="fixed top-16 right-4 z-50 w-64 bg-deep-gray border border-muted-gold rounded-lg shadow-xl backdrop-blur-sm">
              <div className="py-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-700 transition-colors ${
                      location.pathname === item.path ? 'text-muted-gold bg-gray-700' : 'text-pale-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <hr className="my-2 border-gray-600" />
                <button
                  onClick={() => {
                    setShowMenu(false)
                    onLogout()
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Click outside to close menu (desktop only) */}
          {!isMobile && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
          )}
        </>
      )}
    </>
  )
}

export default HUD