const RailService = require('../models/RailService');

exports.createService = async (req, res) => {
  let services = Array.isArray(req.body) ? req.body : [req.body];
  
  if (services.length === 0) {
    return res.status(400).json({ error: 'Service data required' });
  }

  try {
    const serviceIds = [];
    for (const service of services) {
      const { railId, origin, terminus, capacity } = service;
      
      if (!railId || !origin || !terminus || !capacity) {
        return res.status(400).json({ error: 'Incomplete service details' });
      }

      const id = await RailService.create(railId, origin.toLowerCase(), terminus.toLowerCase(), capacity);
      serviceIds.push({ railId, serviceId: id });
    }
    res.json({ status: 'success', data: serviceIds });
  } catch (err) {
    res.status(500).json({ error: 'Service creation failed', details: err.message });
  }
};

exports.updateCapacity = async (req, res) => {
  const { serviceId } = req.params;
  const { capacity, seatsOpen } = req.body;

  if (!capacity || !seatsOpen || seatsOpen > capacity) {
    return res.status(400).json({ error: 'Invalid capacity configuration' });
  }

  try {
    const updated = await RailService.modifyCapacity(serviceId, capacity, seatsOpen);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Capacity update failed', details: err.message });
  }
};