const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const identityController = require('../controllers/identityController');
const passengerAuth = require('../middleware/passengerAuth');

router.post('/signup', identityController.signup);
router.post('/login', identityController.authenticate);
router.get('/services/availability', reservationController.checkAvailability);
router.post('/reservations', passengerAuth, reservationController.createReservation);
router.get('/reservations', passengerAuth, reservationController.getPassengerReservations);

module.exports = router;