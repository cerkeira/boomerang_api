const express = require('express');

const router = express.Router();
const locationController = require('../controllers/location');

router.put('/', locationController.editLocation);

router.get('/', locationController.listUserLocations);

router.post('/', locationController.addLocation);

router.delete('/', locationController.deleteLocation);

module.exports = router;
