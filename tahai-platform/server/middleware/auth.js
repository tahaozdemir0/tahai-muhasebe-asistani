const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token gerekli' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // last_seen güncelle (fire & forget — yanıtı bekleme)
    supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', decoded.id)
      .then(() => {})
      .catch(() => {});

    next();
  } catch (e) {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
};

module.exports = authMiddleware;
