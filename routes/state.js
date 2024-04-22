const express = require('express');

const router = express.Router();
const stateController = require('../controllers/state');

router.get('/', stateController.getAllStates);


module.exports = router
