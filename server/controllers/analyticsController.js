const Invoice = require("../models/Invoice");
const Service = require("../models/Service");

// controllers/analyticsController.js
exports.getRevenueAnalytics = async (req, res, next) => {
    try {
      const { period = 'month' } = req.query; // month|year|week
      const now = new Date();
      let groupQuery;
  
      if (period === 'month') {
        groupQuery = {
          year: { $year: "$issuedAt" },
          month: { $month: "$issuedAt" }
        };
      } else if (period === 'year') {
        groupQuery = { year: { $year: "$issuedAt" } };
      } else { // week
        groupQuery = {
          year: { $year: "$issuedAt" },
          week: { $week: "$issuedAt" }
        };
      }
  
      const revenueData = await Invoice.aggregate([
        {
          $match: {
            issuedAt: { $gte: new Date(now.getFullYear(), 0, 1) } // Current year
          }
        },
        {
          $group: {
            _id: groupQuery,
            totalRevenue: { $sum: "$netAmount" },
            invoiceCount: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      res.json(revenueData);
    } catch (error) {
      next(error);
    }
  };

  exports.getServiceFrequency = async (req, res, next) => {
    try {
      const { months = 6 } = req.query;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));
  
      const data = await Service.aggregate([
        {
          $match: {
            date: { $gte: cutoffDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      res.json(data);
    } catch (error) {
      next(error);
    }
  };