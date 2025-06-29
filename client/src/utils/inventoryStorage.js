export const saveInventoryItem = (item) => {
  return new Promise((resolve, reject) => {
    try {
      // Get existing inventory from localStorage
      const existingInventory = JSON.parse(localStorage.getItem('inventory')) || []
      
      // Check if we're updating an existing item
      const existingIndex = existingInventory.findIndex(i => i.id === item.id)
      
      let updatedInventory
      if (existingIndex >= 0) {
        // Update existing item
        updatedInventory = [
          ...existingInventory.slice(0, existingIndex),
          item,
          ...existingInventory.slice(existingIndex + 1)
        ]
      } else {
        // Add new item
        updatedInventory = [...existingInventory, { ...item, id: Date.now() }]
      }
      
      // Save back to localStorage
      localStorage.setItem('inventory', JSON.stringify(updatedInventory))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export const getInventoryItems = () => {
  return new Promise((resolve, reject) => {
    try {
      const inventory = JSON.parse(localStorage.getItem('inventory')) || []
      resolve(inventory)
    } catch (error) {
      reject(error)
    }
  })
}

export const deleteInventoryItem = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const existingInventory = JSON.parse(localStorage.getItem('inventory')) || []
      const updatedInventory = existingInventory.filter(item => item.id !== id)
      localStorage.setItem('inventory', JSON.stringify(updatedInventory))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}