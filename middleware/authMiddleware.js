// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authenticateOwner = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(403).json({ message: 'No authorization header' });

  const token = header.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Malformed authorization header' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'owner') {
      return res.status(403).json({ message: 'Owner role required' });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
