const Customer = require("../models/Customer");
const { BadRequestError, NotFoundError } = require("../utils/errors");

exports.createOrFindCustomer = async (req, res, next) => {
  try {
    const { vehicleRegNo, name, mobile, address, vehicleModel, engineNo, frameNo } = req.body;

    // Check if customer exists
    let customer = await Customer.findOne({ vehicleRegNo });

    if (!customer) {
      customer = new Customer({
        vehicleRegNo,
        name,
        mobile,
        address,
        vehicleModel,
        engineNo,
        frameNo,
      });
      await customer.save();
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

// controllers/customerController.js
exports.getAllCustomers = async (req, res, next) => {
    try {
      const { search } = req.query;
      const filter = {};
  
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
          { vehicleRegNo: { $regex: search, $options: 'i' } }
        ];
      }
  
      const customers = await Customer.find(filter)
        .sort({ createdAt: -1 });
  
      res.json(customers);
    } catch (error) {
      next(error);
    }
  };

  exports.updateCustomer = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Prevent vehicleRegNo updates if provided
      if (updates.vehicleRegNo) {
        throw new BadRequestError("Vehicle registration number cannot be changed");
      }
  
      const customer = await Customer.findByIdAndUpdate(id, updates, { 
        new: true,
        runValidators: true 
      });
  
      if (!customer) throw new NotFoundError("Customer not found");
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };


  exports.getCustomerById = async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }
  
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };
  