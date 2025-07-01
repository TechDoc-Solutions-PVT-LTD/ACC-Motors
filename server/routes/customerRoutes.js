const express = require("express");
const { getAllCustomers, updateCustomer, getCustomerById, createOrFindCustomer } = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter.get('/', getAllCustomers);
customerRouter.post('/', createOrFindCustomer);
customerRouter.patch('/:id', updateCustomer);
customerRouter.get("/:id", getCustomerById);


module.exports = customerRouter;
