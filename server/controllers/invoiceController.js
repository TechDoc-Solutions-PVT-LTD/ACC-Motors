const Customer = require("../models/Customer");
const Service = require("../models/Service");
const Inventory = require("../models/Inventory");
const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");
const { BadRequestError, NotFoundError } = require("../utils/errors");

const generateInvoiceNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  const prefix = `INV-${dateStr}-`;
  
  // Find the last invoice for today
  const lastInvoice = await Invoice.findOne({
    invoiceNumber: { $regex: `^${prefix}` }
  }).sort({ invoiceNumber: -1 }).limit(1);
  
  let sequence = 1;
  if (lastInvoice) {
    const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSeq + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

exports.getNewInvoiceId = async (req, res, next) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    res.json({ invoiceNumber });
  } catch (error) {
    next(error);
  }
};

// Update createInvoice to use generated number
exports.createInvoice = async (req, res, next) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const { customerId, serviceId, discount = 0 } = req.body;
    
    const service = await Service.findById(serviceId).populate("sparePartsUsed.item");
    if (!service) throw new NotFoundError("Service not found");

    const partsTotal = service.sparePartsUsed.reduce(
      (sum, part) => sum + (part.quantity * part.unitPrice),
      0
    );

    const invoice = new Invoice({
      invoiceNumber,
      customer: customerId,
      service: serviceId,
      totalAmount: service.serviceCost + partsTotal,
      discount,
      netAmount: (service.serviceCost + partsTotal) - discount
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

exports.createCompleteInvoice = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const invoiceNumber = await generateInvoiceNumber();

  try {
    const {
      customerDetails,  
      serviceDetails,   
      discount = 0      
    } = req.body;

    // ===== 1. Handle Customer =====
    let customer = await Customer.findOne({ 
      vehicleRegNo: customerDetails.vehicleRegNo 
    }).session(session);

    if (!customer) {
      customer = new Customer(customerDetails);
      await customer.save({ session });
    }

    // ===== 2. Handle Service & Inventory =====
    const sparePartsUsed = [];
    let partsTotal = 0;

    // Validate and deduct inventory
    for (const part of serviceDetails.sparePartsUsed) {
      const inventoryItem = await Inventory.findById(part.item).session(session);
      if (!inventoryItem) throw new NotFoundError(`Item ${part.item} not found`);
      if (inventoryItem.quantity < part.quantity) {
        throw new BadRequestError(`Insufficient stock for ${inventoryItem.name}`);
      }

      // Update inventory
      inventoryItem.quantity -= part.quantity;
      await inventoryItem.save({ session });

      // Calculate part cost
      const unitPrice = part.unitPrice || inventoryItem.price;
      partsTotal += unitPrice * part.quantity;

      sparePartsUsed.push({
        item: part.item,
        quantity: part.quantity,
        unitPrice
      });
    }

    // Create service
    const service = new Service({
      customer: customer._id,
      km: serviceDetails.km,
      serviceCost: serviceDetails.serviceCost,
      description: serviceDetails.description,
      sparePartsUsed
    });
    await service.save({ session });

    // ===== 3. Create Invoice =====
    const totalAmount = service.serviceCost + partsTotal;
    const netAmount = totalAmount - discount;

    const invoice = new Invoice({
      invoiceNumber,
      customer: customer._id,
      service: service._id,
      totalAmount,
      discount,
      netAmount
    });
    await invoice.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Populate and return full details
    const result = await Invoice.findById(invoice._id)
      .populate("customer")
      .populate({
        path: "service",
        populate: {
          path: "sparePartsUsed.item",
          model: "Inventory"
        }
      });

    res.status(201).json(result);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

 exports.getAllInvoices = async (req, res, next) => {
    try {
      const { status, fromDate, toDate } = req.query;
      const filter = {};
  
      if (status) filter.status = status;
      if (fromDate || toDate) {
        filter.issuedAt = {};
        if (fromDate) filter.issuedAt.$gte = new Date(fromDate);
        if (toDate) filter.issuedAt.$lte = new Date(toDate);
      }
  
      const invoices = await Invoice.find(filter)
        .populate('customer', 'name vehicleRegNo')
        .populate('service', 'date description')
        .sort({ issuedAt: -1 });
  
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  };

  exports.getInvoicesByCustomer = async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const invoices = await Invoice.find({ customer: customerId })
        .populate('service', 'date km serviceCost')
        .sort({ issuedAt: -1 });
  
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  };

  exports.updateInvoiceStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!['pending', 'paid'].includes(status)) {
        throw new BadRequestError("Invalid status. Use 'pending' or 'paid'");
      }
  
      const invoice = await Invoice.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('customer service');
  
      if (!invoice) throw new NotFoundError("Invoice not found");
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  };

  exports.getInvoiceById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const invoice = await Invoice.findById(id)
        .populate('customer')
        .populate({
          path: 'service',
          populate: {
            path: 'sparePartsUsed.item',
            model: 'Inventory'
          }
        });
  
      if (!invoice) {
        throw new NotFoundError('Invoice not found');
      }
  
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  };
  