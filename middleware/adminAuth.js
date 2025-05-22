exports.validateApiKey = (req, res, next) => {
    const providedKey = req.headers['x-api-key'];
    if (providedKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
  };