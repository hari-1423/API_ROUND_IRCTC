const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { validateApiKey } = require('../middleware/adminAuth');

router.post('/services', validateApiKey, serviceController.createService);
router.put('/services/:serviceId/capacity', validateApiKey, serviceController.updateCapacity);

module.exports = router;