const express = require('express');
const bodyParser = require('body-parser');
const emissionsRouter = require("./users/emissions.route")
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.use(cookieParser());

app.use(bodyParser.json())
app.use('/emissions', emissionsRouter);


module.exports = app;

















