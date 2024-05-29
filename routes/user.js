const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { check } = require('express-validator');

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Página de perfil.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do utilizador. Omitir para usar o utilizador logado.
 *     responses:
 *       200:
 *         description: Dados do utilizador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  description: Dados do utilizador
 *       500:
 *         description: Utilizador não encontrado
 */
router.get('/', userController.getUser);

/**
 * @swagger
 * /user/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Pesquisa de utilizadores
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: String de pesquisa
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Página da pesquisa
 *     responses:
 *       200:
 *         description: Resultados da pesquisa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  description: Resultados da pesquisa
 *       500:
 *         description: Erro na pesquisa
 */
router.get('/search', userController.searchUsersByUsername);

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Registo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   locationName:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       201:
 *         description: Utilizador registado
 *         content:
 *           application/json:
 *             schema:
 *                  description: Utilizador registado com sucesso
 *       500:
 *         description: Erro no registo
 */
router.post(
    '/register',
    [
        check('username').notEmpty().withMessage('Username is required'),
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    userController.registerUser
);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilizador logado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Utilizador não foi encontrado
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logout
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro no logout
 */
router.post('/logout', userController.logoutUser);

/**
 * @swagger
 * /user:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Apagar utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilizador apagado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Palavra-passe errada
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro a apagar utilizador
 */
router.delete('/', userController.deleteUser);

/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - Users
 *     summary: Editar utilizador logado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizador atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro a editar utilizador
 */
router.put('/', userController.editUser);

/**
 * @swagger
 * /user/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Editar a password do utilizador logado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Password atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Password errada ou igual à anterior.
 *       404:
 *         description: Utilizador não encontrado.
 *       500:
 *         description: Erro ao atualizar password.
 */
router.put('/password', userController.editPassword);

module.exports = router;
