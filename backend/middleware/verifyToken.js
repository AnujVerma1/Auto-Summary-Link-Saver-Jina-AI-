const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log("Token received:", token);


  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const user = jwt.verify(token, JWT_SECRET);

console.log("JWT_SECRET being used:", JWT_SECRET);

    console.log("Decoded User:", user);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
