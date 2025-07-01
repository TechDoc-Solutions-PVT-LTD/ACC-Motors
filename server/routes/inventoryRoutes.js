const express = require('express');
const { addInventoryItem, getAllInventoryItems, getInventoryItem, updateInventoryItem, deleteInventoryItem, restockInventoryItem } = require('../controllers/inventoryController');
const inventoryRouter = express.Router();

inventoryRouter.post('/', addInventoryItem);
inventoryRouter.get('/', getAllInventoryItems);
inventoryRouter.get('/:id', getInventoryItem);
inventoryRouter.patch('/:id', updateInventoryItem);
inventoryRouter.delete('/:id', deleteInventoryItem);
inventoryRouter.post('/:id/restock', restockInventoryItem);

module.exports = inventoryRouter;