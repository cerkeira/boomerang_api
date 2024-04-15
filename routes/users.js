// const express = require('express');
// const router = express.Router();
// const User = require('../controllers/user');
//
// router.get('/search', async (req, res) => {
//   try {
//     const nameSearch = req.body;
//     const result = await User.find20(nameSearch);
//     console.log("Users Shown");
//     res.json(result[0]);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
//
// module.exports = router;



const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

// Route to get all users
router.get("/", UserController.getAll);

// router.get("/", (req,res) => {
//     res.send('select all')
// });

// Route to get a specific user by ID
router.get("/:id", UserController.getById);

// Route to create a new user
router.post("/", UserController.create);

// Route to update an existing user
router.put("/:id", UserController.update);

// Route to delete a user
router.delete("/:id", UserController.destroy);

module.exports = router;
