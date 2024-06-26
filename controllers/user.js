const User = require('../models/user');
const Location = require('../models/location');
const Product = require('../models/product');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { put } = require('@vercel/blob');
const { v4: uuidv4 } = require('uuid');
const Size = require('../models/size');

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
    // se id não for fornecido, procura por utilizador logado
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
        const userIncludeOptions = {
            include: [Location],
        };
        // encontrar user e moradas
        const user = await User.findByPk(id, userIncludeOptions);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // encontrar produtos e tamanhos (informação para a página de armário)
        const products = await Product.findAll({
            where: { UserId: id },
            include: [{ model: Size, attributes: ['name'] }],
        });

        const userData = user.toJSON();
        userData.products = products;

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Erro : ${error}` });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { username, name, email, gender, password, location } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        let profileImagePath = null;
        if (req.file) {
            const filename = `compressed-${uuidv4()}-${req.file.originalname}`;
            const blob = await put(filename, req.file.buffer, {
                access: 'public',
                mimetype: req.file.mimetype,
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            profileImagePath = blob.url;
        }

        const newUser = await User.create({
            username,
            name,
            email,
            gender,
            password: passwordHash,
            profileImage: profileImagePath,
        });

        // não está implementado no front-endOfDay
        // mas é possível adicionar uma morada no momento do registo
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
        res.status(500).json({ message: `Failed to register user: ${error}` });
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
            return res.status(404).json({ message: 'User not found.' });
        }

        const { username, name, email, gender, bio } = req.body;

        let profileImagePath = null;
        if (req.file) {
            const filename = `compressed-${uuidv4()}-${req.file.originalname}`;
            const blob = await put(filename, req.file.buffer, {
                access: 'public',
                mimetype: req.file.mimetype,
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            profileImagePath = blob.url;
        }
        await User.update(
            {
                username,
                name,
                email,
                gender,
                bio,
                profileImage: profileImagePath,
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
