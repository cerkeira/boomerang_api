// const User= require('../models/user')
//
//
// const user = {
//
//     find20(nameSearch){
//         return User.find(nameSearch)
//     }
//
// }
//
//
//
//
// module.exports = user;



const { UserModel } = require("../models/user");

async function getById(req, res) {
    const { id } = req.params;

    try {
        const userData = await UserModel.findByPk(id);
        if (userData) {
            res.json(userData);
        } else {
            res.status(404).json({
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error retrieving user by id:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function getAll(req, res) {
    try {
        const users = await UserModel.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error retrieving all users:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function create(req, res) {
    const { username, name, email, gender, password, bio, images_id_images } = req.body;

    try {
        const newUser = await UserModel.create({
            username,
            name,
            email,
            gender,
            password,
            bio,
            images_id_images,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function update(req, res) {
    const { id } = req.params;
    const { username, name, email, gender, password, bio, images_id_images } = req.body;

    try {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({
            username,
            name,
            email,
            gender,
            password,
            bio,
            images_id_images,
        });

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function destroy(req, res) {
    const { id } = req.params;

    try {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

const UserController = {
    getById,
    getAll,
    create,
    update,
    destroy,
};

module.exports = UserController;
