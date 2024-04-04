const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log("Users Shown");
    res.json(users.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
