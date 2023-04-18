const express = require('express');
const {httpGetEmissions} = require('./emissions.control')


const emissionsRouter = express.Router();



emissionsRouter.get('/', httpGetEmissions);


module.exports = emissionsRouter;