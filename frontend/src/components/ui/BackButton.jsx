/**
 * BackButton Component
 * Reusable navigation component for returning to previous pages
 * 
 * Features:
 * - Integrates with React Router navigation history
 * - Fallback to main menu if no history available
 * - Consistent styling across all game pages
 * - Mobile-optimized touch target size
 * - Accessibility support with proper ARIA labels
 * 
 * Usage:
 * <BackButton to="/menu" label="Back to Main Menu" />
 * <BackButton /> // Uses browser history or defaults to main menu
 */

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BackButton = ({ 
  to = null, 
  label = "Back", 
  className = "", 
  showIcon = true,
  variant = "secondary" // "primary" | "secondary" | "minimal"
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Handles back navigation with intelligent fallback logic
   * Priority: custom 'to' prop > browser history > main menu
   */
  const handleBack = () => {
    try {
      if (to) {
        // Use custom destination if provided
        navigate(to)
      } else if (window.history.length > 1 && location.key !== 'default') {
        // Use browser history if available and not the first page
        navigate(-1)
      } else {
        // Fallback to main menu
        navigate('/menu')
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Ultimate fallback to main menu
      navigate('/menu')
    }
  }

  /**
   * Gets button styling based on variant
   */
  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-muted-gold focus:ring-opacity-50"
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-crimson to-red-700 hover:from-red-700 hover:to-crimson text-pale-white py-3 px-6 shadow-crimson-glow hover:shadow-lg`
      
      case 'minimal':
        return `${baseStyles} text-muted-gold hover:text-pale-white py-2 px-3 hover:bg-deep-gray hover:bg-opacity-50`
      
      case 'secondary':
      default:
        return `${baseStyles} bg-gradient-to-r from-deep-gray to-gray-700 hover:from-gray-700 hover:to-deep-gray text-pale-white py-2 px-4 border border-muted-gold hover:shadow-glow`
    }
  }

  /**
   * Gets icon size based on variant
   */
  const getIconSize = () => {
    switch (variant) {
      case 'primary':
        return 'text-xl'
      case 'minimal':
        return 'text-lg'
      case 'secondary':
      default:
        return 'text-lg'
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`${getButtonStyles()} ${className}`}
      aria-label={`${label} - Navigate to previous page`}
      type="button"
    >
      {showIcon && (
        <span className={`${getIconSize()} mr-2`} aria-hidden="true">
          ←
        </span>
      )}
      <span className="text-shadow">{label}</span>
    </button>
  )
}

/**
 * BackButtonFixed Component
 * Fixed position back button for mobile-first design
 * Stays in top-left corner for easy thumb access
 */
export const BackButtonFixed = ({ 
  to = null, 
  className = "",
  zIndex = "z-40" 
}) => {
  return (
    <div className={`fixed top-4 left-4 ${zIndex} ${className}`}>
      <BackButton 
        to={to}
        variant="minimal"
        className="bg-black bg-opacity-75 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-90"
        showIcon={true}
        label=""
      />
    </div>
  )
}

/**
 * BackButtonHeader Component
 * Header-integrated back button for page titles
 * Combines navigation with page heading
 */
export const BackButtonHeader = ({ 
  title, 
  to = null, 
  className = "",
  titleClassName = "text-4xl font-bold text-muted-gold glow-text"
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <BackButton 
        to={to}
        variant="secondary"
        className="flex-shrink-0"
      />
      <h1 className={`flex-1 text-center mx-4 ${titleClassName}`}>
        {title}
      </h1>
      {/* Invisible spacer to center the title */}
      <div className="flex-shrink-0 w-[72px]"></div>
    </div>
  )
}

export default BackButton