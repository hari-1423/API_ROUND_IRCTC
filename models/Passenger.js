const db = require('../config/database');

class Passenger {
  constructor(name, email, password, role = 'passenger') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  async save() {
    const [result] = await db.query(
      'INSERT INTO passengers (name, email, password, role) VALUES (?, ?, ?, ?)',
      [this.name, this.email, this.password, this.role]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM passengers WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = Passenger;