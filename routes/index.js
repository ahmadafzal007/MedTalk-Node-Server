const express = require('express')

const V1Router = express.Router();
const ServerRoutes = require("./V1/IndexRoutes");



V1Router.use("/v1",ServerRoutes);

module.exports = V1Router;
