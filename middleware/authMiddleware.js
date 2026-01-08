
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {

  console.log('Authorization:', req.headers.authorization);

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // asegurate de tipar esto en tu Request
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};