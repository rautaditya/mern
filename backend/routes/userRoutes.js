const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../db'); // Import the database connection

router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT email, name, company FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.sendStatus(500); // Internal Server Error
    }
    if (results.length === 0) {
      return res.sendStatus(404); // Not Found
    }
    res.json(results[0]);
  });
});

module.exports = router;
