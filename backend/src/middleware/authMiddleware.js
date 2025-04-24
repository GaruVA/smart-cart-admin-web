// backend/middleware/authMiddleware.js
const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  
  if (!bearerHeader) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = { verifyToken };