/**
 * Inventory Component
 * Displays and manages player's items and equipment
 * 
 * Features:
 * - View all owned items with quantities
 * - Use consumable items (health kits, energy drinks, etc.)
 * - Drop/delete items from inventory
 * - Item filtering by type
 * - Item details and descriptions
 */

import React, { useState } from 'react'

const Inventory = ({ character, onCharacterUpdate }) => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * Gets item type color for UI display
   */
  const getItemTypeColor = (type) => {
    switch (type) {
      case 'drug': return 'text-green-400'
      case 'weapon': return 'text-red-400'
      case 'equipment': return 'text-blue-400'
      case 'consumable': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  /**
   * Gets item type icon
   */
  const getItemTypeIcon = (type) => {
    switch (type) {
      case 'drug': return '🌿'
      case 'weapon': return '🔫'
      case 'equipment': return '🛡️'
      case 'consumable': return '💊'
      default: return '📦'
    }
  }

  /**
   * Filters inventory items by type
   */
  const getFilteredItems = () => {
    if (!character.inventory || !character.inventory.items) return []
    
    if (filterType === 'all') {
      return character.inventory.items
    }
    
    return character.inventory.items.filter(item => item.type === filterType)
  }

  /**
   * Handles item selection for details/actions
   */
  const handleItemSelect = (item) => {
    setSelectedItem(item)
    setShowItemModal(true)
  }

  /**
   * Uses a consumable item
   */
  const useItem = async (item) => {
    if (item.type !== 'consumable') {
      alert('This item cannot be used')
      return
    }

    setIsProcessing(true)

    try {
      let updatedCharacter = { ...character }
      let effectMessage = ''

      // Apply item effects based on item ID
      switch (item.id) {
        case 'health-kit':
          const healthGain = Math.min(50, 100 - updatedCharacter.health)
          updatedCharacter.health = Math.min(100, updatedCharacter.health + 50)
          effectMessage = `Restored ${healthGain} health`
          break
          
        case 'energy-drink':
          const staminaGain = Math.min(25, 100 - updatedCharacter.stamina)
          updatedCharacter.stamina = Math.min(100, updatedCharacter.stamina + 25)
          effectMessage = `Restored ${staminaGain} stamina`
          break
          
        case 'steroids':
          // Temporary effect - in a full implementation, this would be tracked with a timer
          effectMessage = 'Temporary strength boost applied!'
          break
          
        default:
          effectMessage = `Used ${item.name}`
      }

      // Remove one item from inventory
      const itemIndex = updatedCharacter.inventory.items.findIndex(i => i.id === item.id)
      if (itemIndex !== -1) {
        updatedCharacter.inventory.items[itemIndex].quantity -= 1
        
        // Remove item if quantity reaches 0
        if (updatedCharacter.inventory.items[itemIndex].quantity <= 0) {
          updatedCharacter.inventory.items.splice(itemIndex, 1)
        }
      }

      // Update character
      onCharacterUpdate(updatedCharacter)
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Add to activity log
      const activity = {
        id: Date.now(),
        type: 'item_used',
        message: `Used ${item.name}: ${effectMessage}`,
        timestamp: new Date().toISOString()
      }
      
      const savedActivity = localStorage.getItem(`activity_${character.id}`) || '[]'
      const activityList = JSON.parse(savedActivity)
      activityList.unshift(activity)
      localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 50)))

      setShowItemModal(false)
      setSelectedItem(null)
      alert(effectMessage)

    } catch (error) {
      console.error('Use item error:', error)
      alert('Failed to use item. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Drops/deletes an item from inventory
   */
  const dropItem = async (item, quantity = 1) => {
    setIsProcessing(true)

    try {
      let updatedCharacter = { ...character }

      // Remove items from inventory
      const itemIndex = updatedCharacter.inventory.items.findIndex(i => i.id === item.id)
      if (itemIndex !== -1) {
        updatedCharacter.inventory.items[itemIndex].quantity -= quantity
        
        // Remove item if quantity reaches 0 or below
        if (updatedCharacter.inventory.items[itemIndex].quantity <= 0) {
          updatedCharacter.inventory.items.splice(itemIndex, 1)
        }
      }

      // Update character
      onCharacterUpdate(updatedCharacter)
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Add to activity log
      const activity = {
        id: Date.now(),
        type: 'item_dropped',
        message: `Dropped ${quantity}x ${item.name}`,
        timestamp: new Date().toISOString()
      }
      
      const savedActivity = localStorage.getItem(`activity_${character.id}`) || '[]'
      const activityList = JSON.parse(savedActivity)
      activityList.unshift(activity)
      localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 50)))

      setShowItemModal(false)
      setSelectedItem(null)
      alert(`Dropped ${quantity}x ${item.name}`)

    } catch (error) {
      console.error('Drop item error:', error)
      alert('Failed to drop item. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Gets total inventory value (estimated)
   */
  const getTotalInventoryValue = () => {
    if (!character.inventory || !character.inventory.items) return 0
    
    // Rough estimation based on item types
    return character.inventory.items.reduce((total, item) => {
      let estimatedValue = 0
      switch (item.type) {
        case 'drug': estimatedValue = 100
        case 'weapon': estimatedValue = 500
        case 'equipment': estimatedValue = 300
        case 'consumable': estimatedValue = 50
        default: estimatedValue = 25
      }
      return total + (estimatedValue * item.quantity)
    }, 0)
  }

  const inventoryItems = getFilteredItems()
  const totalItems = character.inventory?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            Inventory
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your items and equipment
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span>📦 Items: <span className="text-blue-400">{totalItems}</span></span>
            <span>💰 Est. Value: <span className="text-green-400">${getTotalInventoryValue().toLocaleString()}</span></span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-muted-gold">Filter Items</h2>
            <div className="flex space-x-2">
              {['all', 'drug', 'weapon', 'equipment', 'consumable'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-muted-gold text-charcoal'
                      : 'bg-deep-gray text-pale-white hover:bg-gray-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        {inventoryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventoryItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleItemSelect(item)}
                className="card cursor-pointer hover:border-muted-gold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getItemTypeIcon(item.type)}</span>
                    <h3 className="font-bold text-pale-white">{item.name}</h3>
                  </div>
                  <span className={`text-sm font-bold ${getItemTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="text-lg font-bold text-muted-gold">{item.quantity}</span>
                </div>

                <div className="flex space-x-2">
                  {item.type === 'consumable' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        useItem(item)
                      }}
                      className="btn-secondary flex-1 text-sm py-2"
                      disabled={isProcessing}
                    >
                      Use
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`Drop ${item.name}?`)) {
                        dropItem(item, 1)
                      }
                    }}
                    className="btn-secondary flex-1 text-sm py-2 text-red-400 hover:text-red-300"
                    disabled={isProcessing}
                  >
                    Drop
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl text-gray-600 mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {filterType === 'all' ? 'Empty Inventory' : `No ${filterType} items`}
            </h3>
            <p className="text-gray-500">
              {filterType === 'all' 
                ? 'Visit the streets to buy items and equipment'
                : `You don't have any ${filterType} items. Try a different filter or visit the streets to buy items.`
              }
            </p>
          </div>
        )}

        {/* Item Details Modal */}
        {showItemModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-muted-gold">Item Details</h2>
                <button
                  onClick={() => {
                    setShowItemModal(false)
                    setSelectedItem(null)
                  }}
                  className="text-gray-400 hover:text-pale-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{getItemTypeIcon(selectedItem.type)}</div>
                <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getItemTypeColor(selectedItem.type)} bg-deep-gray`}>
                  {selectedItem.type}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-bold text-muted-gold">{selectedItem.quantity}</span>
                </div>
                
                {selectedItem.type === 'consumable' && (
                  <div className="bg-deep-gray p-3 rounded-lg">
                    <h4 className="font-bold text-green-400 mb-2">Effects:</h4>
                    <div className="text-sm text-gray-300">
                      {selectedItem.id === 'health-kit' && '• Restores 50 health points'}
                      {selectedItem.id === 'energy-drink' && '• Restores 25 stamina points'}
                      {selectedItem.id === 'steroids' && '• Temporary strength boost'}
                    </div>
                  </div>
                )}

                {selectedItem.type === 'weapon' && (
                  <div className="bg-deep-gray p-3 rounded-lg">
                    <h4 className="font-bold text-red-400 mb-2">Weapon Stats:</h4>
                    <div className="text-sm text-gray-300">
                      • Increases combat effectiveness
                      • Required for certain missions
                    </div>
                  </div>
                )}

                {selectedItem.type === 'equipment' && (
                  <div className="bg-deep-gray p-3 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">Equipment Benefits:</h4>
                    <div className="text-sm text-gray-300">
                      • Provides special abilities
                      • Useful for specific missions
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                {selectedItem.type === 'consumable' && (
                  <button
                    onClick={() => useItem(selectedItem)}
                    className="btn-primary flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Using...' : 'Use Item'}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (window.confirm(`Drop all ${selectedItem.name}?`)) {
                      dropItem(selectedItem, selectedItem.quantity)
                    }
                  }}
                  className="btn-secondary flex-1 text-red-400 hover:text-red-300"
                  disabled={isProcessing}
                >
                  Drop All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory