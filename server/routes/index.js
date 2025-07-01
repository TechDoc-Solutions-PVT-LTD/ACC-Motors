const express = require("express");
const customerRouter = require("./customerRoutes");
const analyticsRouter = require("./analyticsRoutes");
const inventoryRouter = require("./inventoryRoutes");
const invoiceRouter = require("./invoiceRoutes");
const serviceRouter = require("./servicesRoutes");
const router = express.Router();;
// const productRouter = require('./productRoutes');

router.use("/customers", customerRouter);
router.use("/analytics", analyticsRouter);
router.use("/inventory", inventoryRouter);
router.use("/invoice", invoiceRouter);
router.use("/service", serviceRouter);

module.exports = router;
