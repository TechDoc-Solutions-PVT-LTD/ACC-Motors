const express = require("express");
const { createCompleteInvoice, getInvoicesByCustomer, updateInvoiceStatus, createInvoice } = require("../controllers/invoiceController");
const invoiceController = require('../controllers/invoiceController');

const invoiceRouter = express.Router();

invoiceRouter.post("/", createInvoice);
invoiceRouter.post("/complete", createCompleteInvoice);
invoiceRouter.get('/customers/:customerId/invoices', getInvoicesByCustomer);
invoiceRouter.get('/new-id', invoiceController.getNewInvoiceId)
invoiceRouter.patch('/:id/status', updateInvoiceStatus);

module.exports = invoiceRouter;