const express = require('express');
const cardsRoute = require('./routes/cardRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1/cards', cardsRoute);

module.exports = app;