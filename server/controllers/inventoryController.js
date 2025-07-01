const Inventory = require("../models/Inventory");
const { BadRequestError, NotFoundError } = require("../utils/errors");

exports.addInventoryItem = async (req, res, next) => {
  try {
    const { name, sku, price, quantity, category } = req.body;

    // Validation
    if (!name || !sku || price == null || quantity == null || !category) {
      throw new BadRequestError("All fields (name, sku, price, quantity, category) are required");
    }

    if (price <= 0 || quantity < 0) {
      throw new BadRequestError("Price and quantity must be positive values");
    }

    const existingItem = await Inventory.findOne({ sku });
    if (existingItem) {
      throw new BadRequestError("SKU must be unique");
    }

    const item = new Inventory({ name, sku, price, quantity, category });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};


// 2. READ (Get All Items)

exports.getAllInventoryItems = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, inStock } = req.query;
    const filter = {};

    // Filters
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') filter.quantity = { $gt: 0 };

    const items = await Inventory.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};


// 3. READ (Get Single Item)

exports.getInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) throw new NotFoundError("Inventory item not found");
    res.json(item);
  } catch (error) {
    next(error);
  }
};


// 4. UPDATE (Edit Item)

exports.updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent SKU changes
    if (updates.sku) {
      throw new BadRequestError("SKU cannot be modified");
    }

    // Validate price/quantity
    if (updates.price != null && updates.price <= 0) {
      throw new BadRequestError("Price must be positive");
    }
    if (updates.quantity != null && updates.quantity < 0) {
      throw new BadRequestError("Quantity cannot be negative");
    }

    const item = await Inventory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!item) throw new NotFoundError("Inventory item not found");
    res.json(item);
  } catch (error) {
    next(error);
  }
};


// 5. DELETE (Remove Item)

exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) throw new NotFoundError("Inventory item not found");
    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    next(error);
  }
};


// 6. RESTOCK (Add Quantity)

exports.restockInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      throw new BadRequestError("Quantity must be a positive number");
    }

    const item = await Inventory.findById(id);
    if (!item) throw new NotFoundError("Inventory item not found");

    item.quantity += Number(quantity);
    await item.save();

    res.json({
      message: `Restocked ${quantity} units to ${item.name}`,
      updatedQuantity: item.quantity
    });
  } catch (error) {
    next(error);
  }
};