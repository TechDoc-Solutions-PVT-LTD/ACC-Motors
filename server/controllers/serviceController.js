const Service = require("../models/Service");
const Inventory = require("../models/Inventory");
const { BadRequestError, NotFoundError } = require("../utils/errors");

exports.createService = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerId, km, serviceCost, sparePartsUsed, description } = req.body;

    // Deduct inventory
    for (const part of sparePartsUsed) {
      const item = await Inventory.findById(part.item).session(session);
      if (!item) throw new NotFoundError(`Spare part ${part.item} not found`);
      if (item.quantity < part.quantity) throw new BadRequestError(`Insufficient stock for ${item.name}`);

      item.quantity -= part.quantity;
      await item.save();
    }

    // Create service
    const service = new Service({
      customer: customerId,
      km,
      serviceCost,
      sparePartsUsed,
      description,
    });

    await service.save({ session });
    await session.commitTransaction();

    res.status(201).json(service);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};