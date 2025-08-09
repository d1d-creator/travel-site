const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
function requireAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}
module.exports = { requireAuth };
