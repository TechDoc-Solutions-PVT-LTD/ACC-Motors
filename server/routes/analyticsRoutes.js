const express = require("express");
const { getRevenueAnalytics, getServiceFrequency } = require("../controllers/analyticsController");

const analyticsRouter = express.Router();

analyticsRouter.get('/revenue', getRevenueAnalytics);
analyticsRouter.get('/services', getServiceFrequency);

module.exports = analyticsRouter;
