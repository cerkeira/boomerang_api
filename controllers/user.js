const User = require('../models/user');
const Location = require('../models/location');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.searchUsersByUsername = async (req, res) => {
    try {
        const { username, page } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;

        const users = await User.findAll({
            where: {
                username: {
                    [Sequelize.Op.iLike]: `%${username}%`,
                },
            },
            attributes: ['id', 'username', 'name', 'profileImage'],
            limit,
            offset,
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users.' });
    }
};

exports.getUser = async (req, res) => {
    let { id } = req.query;
    console.log('id', id);
    if (!id) {
        const loggedUser = req.session.user;
        if (loggedUser) {
            const existingUser = await User.findOne({
                where: { username: loggedUser },
            });
            id = existingUser.id;
        } else {
            return res
                .status(500)
                .json({ message: 'Utilizador não encontrado.' });
        }
    }
    try {
        const user = await User.findByPk(id, {
            include: Location,
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
};

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
            profileImage: req.file ? req.file.filename : null,
        });

        if (location) {
            const { locationName, address } = location;
            const newLocation = await Location.create({
                name: locationName,
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
            return res.status(404).json({
                message: 'Utilizador não encontrado',
            });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(403).json({
                message: 'Palavra-passe inválida',
            });
        }

        req.session.user = username;

        res.status(200).json({
            message: `${req.session.user} is now logged in.`,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Utilizador não encontrado.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        const { password } = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Utilizador não encontrado.' });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(403).json({ message: 'Invalid password.' });
        }

        await User.destroy({ where: { username: loggedUser } });
        res.clearCookie('connect.sid');

        res.status(200).json({ message: `${loggedUser} has been deleted` });
        req.session.destroy();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('connect.sid');
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
            return res
                .status(404)
                .json({ message: 'Utilizador não encontrado.' });
        }

        const { username, name, email, gender, bio } = req.body;

        await User.update(
            {
                username,
                name,
                email,
                gender,
                bio,
                profileImage: req.file ? req.file.filename : null,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res
                .status(404)
                .json({ message: 'Utilizador não encontrado.' });
        }

        const { password, newPassword } = req.body;

        const existingUser = await User.findOne({
            where: { username: loggedUser },
        });

        const passwordCheck = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!passwordCheck) {
            return res.status(403).json({
                message: 'Present password is invalid.',
            });
        }

        const passwordHistoryCheck = await bcrypt.compare(
            newPassword,
            existingUser.password
        );
        if (passwordHistoryCheck) {
            return res.status(403).json({
                message:
                    'New password needs to be diferent from last password.',
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

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
