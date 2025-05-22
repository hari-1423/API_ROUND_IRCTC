const db = require('../config/database');

const RailService = {
  create: async (railId, origin, terminus, capacity) => {
    const [result] = await db.query(
      'INSERT INTO rail_services (rail_id, origin, terminus, seat_capacity, seats_open) VALUES (?, ?, ?, ?, ?)',
      [railId, origin, terminus, capacity, capacity]
    );
    return result.insertId;
  },

  findByRoute: async (origin, terminus) => {
    const [rows] = await db.query(
      'SELECT * FROM rail_services WHERE LOWER(origin) = LOWER(?) AND LOWER(terminus) = LOWER(?)',
      [origin.trim(), terminus.trim()]
    );
    return rows;
  },

  modifyCapacity: async (serviceId, capacity, seatsOpen) => {
    const [result] = await db.query(
      'UPDATE rail_services SET seat_capacity = ?, seats_open = ? WHERE id = ?',
      [capacity, seatsOpen, serviceId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = RailService;