const db = require('../config/database');
const RailService = require('../models/RailService');
const Reservation = require('../models/Reservation');

exports.checkAvailability = async (req, res) => {
  const { origin, terminus } = req.query;

  if (!origin || !terminus) {
    return res.status(400).json({ error: 'Origin and terminus required' });
  }

  try {
    const services = await RailService.findByRoute(origin, terminus);
    const availableServices = services.map(service => ({
      railId: service.rail_id,
      seatsOpen: service.seats_open
    }));

    res.json({
      hasAvailability: availableServices.some(s => s.seatsOpen > 0),
      serviceCount: availableServices.length,
      services: availableServices
    });
  } catch (err) {
    res.status(500).json({ error: 'Availability check failed', details: err.message });
  }
};

exports.createReservation = async (req, res) => {
  const { serviceId, seatCount } = req.body;
  const passengerId = req.user.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [service] = await connection.query(
      'SELECT seats_open FROM rail_services WHERE id = ? FOR UPDATE',
      [serviceId]
    );

    if (!service.length || service[0].seats_open < seatCount) {
      await connection.rollback();
      return res.status(400).json({ error: 'Reservation not available' });
    }

    await connection.query(
      'UPDATE rail_services SET seats_open = seats_open - ? WHERE id = ?',
      [seatCount, serviceId]
    );

    await Reservation.create(passengerId, serviceId, seatCount, connection);
    await connection.commit();
    
    res.json({ status: 'success' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Reservation failed', details: err.message });
  } finally {
    connection.release();
  }
};

exports.getPassengerReservations = async (req, res) => {
  try {
    const [reservations] = await db.query(`
      SELECT 
        r.id, r.seat_count,
        s.rail_id, s.origin, s.terminus
      FROM reservations r
      JOIN rail_services s ON r.service_id = s.id
      WHERE r.passenger_id = ?
    `, [req.user.id]);
    
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Reservation fetch failed', details: err.message });
  }
};