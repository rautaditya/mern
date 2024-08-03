const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

exports.register = (req, res) => {
  const { email, password, name, company } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    'INSERT INTO users (email, password, name, company) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, company],
    (err, results) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).send('Error on the server.');
      }
      const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, { expiresIn: 86400 });
      res.status(201).send({ auth: true, token });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error on the server.');
    }
    if (results.length === 0) {
      return res.status(404).send('No user found.');
    }
    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
};
