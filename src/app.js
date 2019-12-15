const express = require('express');
const twitterApi = require('./twitter-api.js'); 
const app = express();

app.get('/tweets', twitterApi);

module.exports = app;