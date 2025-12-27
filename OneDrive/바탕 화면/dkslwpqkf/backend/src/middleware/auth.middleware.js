import jwt from 'jsonwebtoken';
import { getUserByPersonalKey } from '../services/user.service.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      const user = await getUserByPersonalKey(decoded.personalKey);
      if (!user) {
        return res.status(403).json({ error: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Error in authentication:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  });
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      name: user.name,
      personalKey: user.personal_key 
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
