const db = require('../config/database');
const Reservation = {
  create: async (passengerId, serviceId, seatCount, connection) => {
    const [result] = await connection.query(
      'INSERT INTO reservations (passenger_id, service_id, seat_count) VALUES (?, ?, ?)',
      [passengerId, serviceId, seatCount]
    );
    return result.insertId;
  }
};

module.exports = Reservation;