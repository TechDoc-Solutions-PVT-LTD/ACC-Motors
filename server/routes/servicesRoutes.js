const express = require("express");
const { createService } = require("../controllers/serviceController");

const serviceRouter = express.Router();

serviceRouter.post('/', createService);


module.exports = serviceRouter;
