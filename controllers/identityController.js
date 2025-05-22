const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Passenger = require('../models/Passenger');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingPassenger = await Passenger.findByEmail(email);
    if (existingPassenger) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const passenger = new Passenger(name, email, hashedPassword);
    await passenger.save();
    
    res.status(201).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const passenger = await Passenger.findByEmail(email);
    if (!passenger || !(await bcrypt.compare(password, passenger.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: passenger.id, role: passenger.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
};