const User = require('../models/user');

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
