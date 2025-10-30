/**
 * LoadingScreen Component
 * Displays animated loading screen while app initializes
 * 
 * Features:
 * - Animated spinner with RPG theme
 * - Game title and branding
 * - Smooth fade-in animation
 * - Responsive design
 */

import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal bg-vignette">
      <div className="text-center">
        {/* Game Title */}
        <h1 className="text-5xl font-bold text-muted-gold glow-text mb-8 animate-pulse">
          NARCO LIFE RPG
        </h1>

        {/* Loading Spinner */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-deep-gray border-t-muted-gold rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-transparent border-t-crimson rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Loading Text */}
        <p className="text-xl text-gray-400 mb-4 animate-pulse">
          Entering the Underground...
        </p>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-muted-gold rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-muted-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-muted-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Flavor Text */}
        <div className="mt-12 max-w-md mx-auto">
          <p className="text-sm text-gray-500 italic">
            "In the shadows of the city, fortunes are made and lost. 
            Your journey into the criminal underworld begins now..."
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen