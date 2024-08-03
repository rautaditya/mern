const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db'); // Your database connection

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Server error');
      if (!isMatch) return res.status(400).send('Invalid credentials');

      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};
