const User = require('../models/user');
const { Sequelize } = require('sequelize');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id_users',
        'username',
        'name',
        'email',
        'gender',
        'bio',
        'images_id_images',
      ],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fraco...' });
  }
};


exports.searchUsersByUsername = async (req, res) => {
  try {
    const { username, page } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      where: {
        username: {
          [Sequelize.Op.like]: `%${username}%`,
        },
      },
      attributes: ['username', 'name', 'images_id_images'],
      limit,
      offset,
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search users.' });
  }
};
