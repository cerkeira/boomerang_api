const User = require('../models/user');
const Location = require('../models/location');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const Product = require('../models/product');

// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll({
//             attributes: [
//                 'id_users',
//                 'username',
//                 'name',
//                 'email',
//                 'gender',
//                 'bio',
//                 'images_id_images',
//             ],
//         })
//         res.json(users)
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ message: 'Failed to fetch user.' })
//     }
// }

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
            attributes: ['id', 'username', 'name'],
            limit,
            offset,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users.' });
    }
};

exports.getUser = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    try {
        const users = await User.findByPk(id);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { username, name, email, gender, password, location } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            username,
            name,
            email,
            gender,
            password: passwordHash,
        });

        if (location) {
            const { locationName, address } = location;
            const newLocation = await Location.create({
                locationName,
                address,
            });
            await newUser.addLocation(newLocation);
        }

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error('User not found');
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            throw new Error('Invalid password');
        }

        req.session.user = username;

        res.status(200).json({
            message: `${req.session.user} is now logged in.`,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'i he koe' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const loggedUser = req.session.user;

        const { username } = req.query;

        if (loggedUser !== username) {
            return res
                .status(403)
                .json({ message: `${loggedUser} can't delete ${username}` });
        }

        await User.destroy({
            where: {
                username: username,
            },
            attributes: ['username'],
        });

        res.status(200).json({ message: `${username} has been deleted` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ko Iron Man ahau' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to logout' });
    }
};

exports.editUser = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, name, email, gender, bio } = req.body;

        await User.update(
            {
                username,
                name,
                email,
                gender,
                bio,
            },
            {
                where: { username: loggedUser },
            }
        );

        res.status(201).json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to edit user.' });
    }
};

exports.editPassword = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password } = req.body;

        const existingUser = await User.findOne({
            where: { username: loggedUser },
        });

        const passwordCheck = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (passwordCheck) {
            return res.status(403).json({
                message:
                    'New password needs to be diferent from last password.',
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await User.update(
            {
                password: passwordHash,
            },
            {
                where: { username: loggedUser },
            }
        );

        res.status(201).json({ message: 'Password updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to change password.' });
    }
};

exports.editLocation = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { locationId, name, address } = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });

        const userLocation = await Location.findByPk(locationId);

        if (!userLocation || userLocation.UserId !== user.id) {
            return res.status(404).json({
                message: 'Location not found or does not belong to the user',
            });
        }

        await userLocation.update({ name, address });

        res.status(200).json({ message: 'Location updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to edit location.' });
    }
};

exports.listUserLocations = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findOne({ where: { username: loggedUser } });

        const userLocations = await user.getLocations();

        res.status(200).json(userLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to list user locations.' });
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
            attributes: ['id', 'username', 'name'],
            include: [{ model: Product, attributes: ['id'], as: 'products' }],
            limit,
            offset,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users.' });
    }
};

exports.getUser = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    try {
        const user = await User.findByPk(id, {
            include: [{ model: Product, attributes: ['id'], as: 'products' }], // Incluindo os produtos do usuário
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
};
