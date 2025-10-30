/**
 * Streets Component - Marketplace
 * NPCs for buying and selling items and drugs with dynamic pricing
 * 
 * Features:
 * - Location-based NPCs with different inventories
 * - Dynamic pricing that fluctuates over time
 * - Buy/sell transactions with inventory management
 * - Different NPC types (dealers, merchants, fences)
 * - Transaction validation and error handling
 */

import React, { useState, useEffect } from 'react'

const Streets = ({ character, onCharacterUpdate }) => {
  const [npcs, setNpcs] = useState([])
  const [selectedNpc, setSelectedNpc] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [transactionType, setTransactionType] = useState('buy') // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1)
  const [showTransaction, setShowTransaction] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Item database with base prices and descriptions
  const itemDatabase = {
    // Drugs
    'marijuana': { name: 'Marijuana', type: 'drug', basePrice: 50, description: 'High-quality cannabis' },
    'cocaine': { name: 'Cocaine', type: 'drug', basePrice: 200, description: 'Pure Colombian powder' },
    'heroin': { name: 'Heroin', type: 'drug', basePrice: 300, description: 'Black tar heroin' },
    'ecstasy': { name: 'Ecstasy', type: 'drug', basePrice: 25, description: 'Party pills' },
    'meth': { name: 'Methamphetamine', type: 'drug', basePrice: 150, description: 'Crystal meth' },
    
    // Weapons
    'pistol': { name: 'Pistol', type: 'weapon', basePrice: 500, description: '9mm handgun' },
    'shotgun': { name: 'Shotgun', type: 'weapon', basePrice: 800, description: 'Pump-action shotgun' },
    'rifle': { name: 'Assault Rifle', type: 'weapon', basePrice: 1500, description: 'Military-grade rifle' },
    'knife': { name: 'Combat Knife', type: 'weapon', basePrice: 100, description: 'Sharp tactical blade' },
    
    // Equipment
    'body-armor': { name: 'Body Armor', type: 'equipment', basePrice: 1000, description: 'Bulletproof vest' },
    'lockpicks': { name: 'Lockpicks', type: 'equipment', basePrice: 75, description: 'Professional lockpicking set' },
    'fake-id': { name: 'Fake ID', type: 'equipment', basePrice: 250, description: 'High-quality forged documents' },
    'burner-phone': { name: 'Burner Phone', type: 'equipment', basePrice: 50, description: 'Untraceable communication' },
    
    // Consumables
    'health-kit': { name: 'Health Kit', type: 'consumable', basePrice: 100, description: 'Restores 50 health' },
    'energy-drink': { name: 'Energy Drink', type: 'consumable', basePrice: 20, description: 'Restores 25 stamina' },
    'steroids': { name: 'Steroids', type: 'consumable', basePrice: 200, description: 'Temporary strength boost' }
  }

  // NPC database with location-specific inventories
  const npcDatabase = {
    'Los Angeles': [
      {
        id: 'la-dealer-1',
        name: 'Miguel "El Jefe"',
        type: 'Drug Dealer',
        description: 'Veteran dealer with premium products',
        inventory: ['marijuana', 'cocaine', 'ecstasy'],
        buysPriceMultiplier: 0.7,
        sellsPriceMultiplier: 1.3,
        avatar: '🕴️'
      },
      {
        id: 'la-fence-1',
        name: 'Tony the Fence',
        type: 'Fence',
        description: 'Buys and sells stolen goods',
        inventory: ['pistol', 'knife', 'lockpicks', 'fake-id'],
        buysPriceMultiplier: 0.6,
        sellsPriceMultiplier: 1.4,
        avatar: '🥷'
      },
      {
        id: 'la-medic-1',
        name: 'Dr. Rodriguez',
        type: 'Street Medic',
        description: 'No questions asked medical supplies',
        inventory: ['health-kit', 'steroids', 'energy-drink'],
        buysPriceMultiplier: 0.8,
        sellsPriceMultiplier: 1.2,
        avatar: '👨‍⚕️'
      }
    ],
    'Miami': [
      {
        id: 'miami-dealer-1',
        name: 'Carlos "Scarface"',
        type: 'Drug Lord',
        description: 'High-end dealer with connections',
        inventory: ['cocaine', 'heroin', 'meth'],
        buysPriceMultiplier: 0.8,
        sellsPriceMultiplier: 1.2,
        avatar: '👑'
      },
      {
        id: 'miami-arms-1',
        name: 'Viktor the Russian',
        type: 'Arms Dealer',
        description: 'Military surplus and heavy weapons',
        inventory: ['shotgun', 'rifle', 'body-armor', 'pistol'],
        buysPriceMultiplier: 0.7,
        sellsPriceMultiplier: 1.3,
        avatar: '🔫'
      }
    ],
    'New York': [
      {
        id: 'ny-dealer-1',
        name: 'Johnny "The Nose"',
        type: 'Street Dealer',
        description: 'Old-school dealer with street smarts',
        inventory: ['marijuana', 'ecstasy', 'burner-phone'],
        buysPriceMultiplier: 0.75,
        sellsPriceMultiplier: 1.25,
        avatar: '🤵'
      },
      {
        id: 'ny-tech-1',
        name: 'Hacker Sam',
        type: 'Tech Specialist',
        description: 'Digital goods and equipment',
        inventory: ['fake-id', 'burner-phone', 'lockpicks'],
        buysPriceMultiplier: 0.6,
        sellsPriceMultiplier: 1.4,
        avatar: '💻'
      }
    ],
    'Tijuana': [
      {
        id: 'tj-dealer-1',
        name: 'Eduardo "El Lobo"',
        type: 'Cartel Dealer',
        description: 'Connected to major cartels',
        inventory: ['marijuana', 'cocaine', 'heroin', 'meth'],
        buysPriceMultiplier: 0.5,
        sellsPriceMultiplier: 1.5,
        avatar: '🐺'
      },
      {
        id: 'tj-smuggler-1',
        name: 'Rosa the Smuggler',
        type: 'Smuggler',
        description: 'Moves goods across borders',
        inventory: ['fake-id', 'body-armor', 'knife'],
        buysPriceMultiplier: 0.7,
        sellsPriceMultiplier: 1.3,
        avatar: '🚚'
      }
    ],
    'Juarez': [
      {
        id: 'jz-dealer-1',
        name: 'Pablo "El Martillo"',
        type: 'Enforcer',
        description: 'Muscle for hire and weapons dealer',
        inventory: ['pistol', 'shotgun', 'knife', 'steroids'],
        buysPriceMultiplier: 0.8,
        sellsPriceMultiplier: 1.2,
        avatar: '🔨'
      }
    ],
    'Puerto Vallarta': [
      {
        id: 'pv-dealer-1',
        name: 'Isabella "La Reina"',
        type: 'Resort Dealer',
        description: 'Supplies the tourist trade',
        inventory: ['marijuana', 'ecstasy', 'cocaine', 'energy-drink'],
        buysPriceMultiplier: 0.9,
        sellsPriceMultiplier: 1.1,
        avatar: '👸'
      }
    ]
  }

  /**
   * Load NPCs for current location on component mount
   */
  useEffect(() => {
    loadLocationNpcs()
  }, [character.location])

  /**
   * Loads NPCs available in the current location
   */
  const loadLocationNpcs = () => {
    const locationNpcs = npcDatabase[character.location] || []
    
    // Add dynamic pricing fluctuations
    const npcsWithPricing = locationNpcs.map(npc => ({
      ...npc,
      currentPrices: generateDynamicPrices(npc)
    }))
    
    setNpcs(npcsWithPricing)
  }

  /**
   * Generates dynamic prices for NPC inventory
   */
  const generateDynamicPrices = (npc) => {
    const prices = {}
    
    npc.inventory.forEach(itemId => {
      const item = itemDatabase[itemId]
      if (item) {
        // Add random fluctuation (-20% to +30%)
        const fluctuation = 0.8 + (Math.random() * 0.5)
        const buyPrice = Math.round(item.basePrice * npc.buysPriceMultiplier * fluctuation)
        const sellPrice = Math.round(item.basePrice * npc.sellsPriceMultiplier * fluctuation)
        
        prices[itemId] = {
          buy: sellPrice, // Price player pays to buy from NPC
          sell: buyPrice  // Price NPC pays to buy from player
        }
      }
    })
    
    return prices
  }

  /**
   * Gets player's inventory quantity for an item
   */
  const getPlayerItemQuantity = (itemId) => {
    if (!character.inventory || !character.inventory.items) return 0
    const item = character.inventory.items.find(i => i.id === itemId)
    return item ? item.quantity : 0
  }

  /**
   * Handles NPC selection
   */
  const handleNpcSelect = (npc) => {
    setSelectedNpc(npc)
    setSelectedItem(null)
    setTransactionType('buy')
    setQuantity(1)
  }

  /**
   * Handles item selection for transaction
   */
  const handleItemSelect = (itemId, type) => {
    setSelectedItem(itemId)
    setTransactionType(type)
    setQuantity(1)
    setShowTransaction(true)
  }

  /**
   * Processes buy/sell transaction
   */
  const processTransaction = async () => {
    if (!selectedNpc || !selectedItem) return

    setIsProcessing(true)

    try {
      const item = itemDatabase[selectedItem]
      const price = selectedNpc.currentPrices[selectedItem]
      
      if (!item || !price) {
        throw new Error('Invalid item or pricing')
      }

      let updatedCharacter = { ...character }
      let totalCost = 0
      let resultMessage = ''

      if (transactionType === 'buy') {
        // Buying from NPC
        totalCost = price.buy * quantity
        
        if (updatedCharacter.cash < totalCost) {
          throw new Error('Not enough cash for this purchase')
        }

        // Deduct cash
        updatedCharacter.cash -= totalCost

        // Add items to inventory
        if (!updatedCharacter.inventory) {
          updatedCharacter.inventory = { items: [], drugs: [] }
        }
        if (!updatedCharacter.inventory.items) {
          updatedCharacter.inventory.items = []
        }

        const existingItem = updatedCharacter.inventory.items.find(i => i.id === selectedItem)
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          updatedCharacter.inventory.items.push({
            id: selectedItem,
            name: item.name,
            type: item.type,
            quantity: quantity
          })
        }

        resultMessage = `Bought ${quantity}x ${item.name} for $${totalCost.toLocaleString()}`
      } else {
        // Selling to NPC
        const playerQuantity = getPlayerItemQuantity(selectedItem)
        
        if (playerQuantity < quantity) {
          throw new Error('Not enough items to sell')
        }

        totalCost = price.sell * quantity

        // Add cash
        updatedCharacter.cash += totalCost

        // Remove items from inventory
        const itemIndex = updatedCharacter.inventory.items.findIndex(i => i.id === selectedItem)
        if (itemIndex !== -1) {
          updatedCharacter.inventory.items[itemIndex].quantity -= quantity
          
          // Remove item if quantity reaches 0
          if (updatedCharacter.inventory.items[itemIndex].quantity <= 0) {
            updatedCharacter.inventory.items.splice(itemIndex, 1)
          }
        }

        resultMessage = `Sold ${quantity}x ${item.name} for $${totalCost.toLocaleString()}`
      }

      // Update character
      onCharacterUpdate(updatedCharacter)
      localStorage.setItem('currentCharacter', JSON.stringify(updatedCharacter))

      // Add to activity log
      const activity = {
        id: Date.now(),
        type: transactionType === 'buy' ? 'item_purchased' : 'item_sold',
        message: resultMessage,
        timestamp: new Date().toISOString()
      }
      
      const savedActivity = localStorage.getItem(`activity_${character.id}`) || '[]'
      const activityList = JSON.parse(savedActivity)
      activityList.unshift(activity)
      localStorage.setItem(`activity_${character.id}`, JSON.stringify(activityList.slice(0, 50)))

      // Close transaction modal
      setShowTransaction(false)
      setSelectedItem(null)
      
      // Show success message
      alert(resultMessage)

    } catch (error) {
      console.error('Transaction error:', error)
      alert(error.message || 'Transaction failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Gets item type color for UI
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-muted-gold glow-text mb-2">
            The Streets
          </h1>
          <p className="text-gray-400 text-lg">
            Trade with local dealers and merchants
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span>📍 Location: <span className="text-muted-gold">{character.location}</span></span>
            <span>💰 Cash: <span className="text-green-400">${character.cash.toLocaleString()}</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - NPCs */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-muted-gold mb-4">Local Contacts</h2>
              
              {npcs.length > 0 ? (
                <div className="space-y-4">
                  {npcs.map(npc => (
                    <div
                      key={npc.id}
                      onClick={() => handleNpcSelect(npc)}
                      className={`npc-card cursor-pointer transition-all duration-300 ${
                        selectedNpc && selectedNpc.id === npc.id 
                          ? 'border-muted-gold bg-gradient-to-r from-deep-gray to-yellow-900' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{npc.avatar}</span>
                        <div>
                          <h3 className="font-bold text-pale-white">{npc.name}</h3>
                          <p className="text-sm text-gray-400">{npc.type}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">{npc.description}</p>
                      <div className="mt-2 text-xs text-muted-gold">
                        {npc.inventory.length} items available
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-600 mb-2">🏪</div>
                  <p className="text-gray-400">No contacts available in this location</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - NPC Inventory */}
          <div className="lg:col-span-2">
            {selectedNpc ? (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-muted-gold">
                      {selectedNpc.avatar} {selectedNpc.name}
                    </h2>
                    <p className="text-gray-400">{selectedNpc.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedNpc.inventory.map(itemId => {
                    const item = itemDatabase[itemId]
                    const price = selectedNpc.currentPrices[itemId]
                    const playerQuantity = getPlayerItemQuantity(itemId)
                    
                    if (!item || !price) return null

                    return (
                      <div key={itemId} className="card bg-deep-gray">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-pale-white">{item.name}</h3>
                          <span className={`text-sm font-bold ${getItemTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 mb-4">{item.description}</p>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span>Buy Price:</span>
                            <span className="text-red-400">${price.buy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sell Price:</span>
                            <span className="text-green-400">${price.sell}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>You Own:</span>
                            <span className="text-blue-400">{playerQuantity}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleItemSelect(itemId, 'buy')}
                            className="btn-secondary flex-1 text-sm py-2"
                            disabled={character.cash < price.buy}
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => handleItemSelect(itemId, 'sell')}
                            className="btn-secondary flex-1 text-sm py-2"
                            disabled={playerQuantity === 0}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl text-gray-600 mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Contact</h3>
                <p className="text-gray-500">Choose someone to trade with from the list on the left</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Modal */}
        {showTransaction && selectedItem && selectedNpc && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-muted-gold">
                {transactionType === 'buy' ? 'Purchase' : 'Sell'} Item
              </h2>

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">{itemDatabase[selectedItem].name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {itemDatabase[selectedItem].description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Price per item:</span>
                    <span className={transactionType === 'buy' ? 'text-red-400' : 'text-green-400'}>
                      ${selectedNpc.currentPrices[selectedItem][transactionType]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="btn-secondary px-2 py-1 text-sm"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => {
                          const maxQuantity = transactionType === 'buy' 
                            ? Math.floor(character.cash / selectedNpc.currentPrices[selectedItem].buy)
                            : getPlayerItemQuantity(selectedItem)
                          setQuantity(Math.min(maxQuantity, quantity + 1))
                        }}
                        className="btn-secondary px-2 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className={transactionType === 'buy' ? 'text-red-400' : 'text-green-400'}>
                      ${(selectedNpc.currentPrices[selectedItem][transactionType] * quantity).toLocaleString()}
                    </span>
                  </div>

                  {transactionType === 'buy' && (
                    <div className="text-sm text-gray-400">
                      Remaining cash: ${(character.cash - (selectedNpc.currentPrices[selectedItem].buy * quantity)).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowTransaction(false)
                    setSelectedItem(null)
                  }}
                  className="btn-secondary flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={processTransaction}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing || (transactionType === 'buy' && character.cash < selectedNpc.currentPrices[selectedItem].buy * quantity)}
                >
                  {isProcessing ? 'Processing...' : (transactionType === 'buy' ? 'Buy' : 'Sell')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Streets



