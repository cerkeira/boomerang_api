const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');


router.get('/', notificationController.getUserNotifications);

module.exports = router;
