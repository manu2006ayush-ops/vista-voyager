const express = require('express');
const { getDestinationWeather } = require('../controllers/weatherController');

const router = express.Router();

router.get('/:slug', getDestinationWeather);

module.exports = router;
