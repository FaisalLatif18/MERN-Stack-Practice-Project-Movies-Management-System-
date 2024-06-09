// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;

const moviesController = require('./api/controller');
require('./modules/db'); // Ensure this path is correct
// Use the controller for routing
app.use('/api', moviesController); // Prefix routes with /api

// Port
app.listen(port, () => console.log(`App is listening at port ${port}`));
