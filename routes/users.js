const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.get('/search', async (req, res) => {
  try {
    const nameSearch = req.body; 
    const result = await User.find20(nameSearch);
    console.log("Users Shown");
    res.json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
