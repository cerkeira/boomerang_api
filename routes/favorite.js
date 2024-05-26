const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite');
const { check } = require('express-validator');

/**
 * @swagger
 * /favorite:
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Ver produtos favoritos do utilizador logado
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Utilizador não está logado
 *       500:
 *         description: Erro ao encontrar produtos favoritos
 */
router.get('/', favoriteController.getFavoriteProducts);

/**
 * @swagger
 * /favorite/add:
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Adicionar produto aos favoritos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto adicionado aos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Input Inválido
 *       401:
 *         description: Utilizador não está logado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao adicionar produto aos favoritos
 */
router.post(
    '/add',
    [check('productId').isInt().withMessage('Product ID must be an integer')],
    favoriteController.addToFavorites
);

/**
 * @swagger
 * /favorite/remove:
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Remover produto dos favoritos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto removido dos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Input Inválido
 *       401:
 *         description: Utilizador não está logado
 *       404:
 *         description: Produto não está nos favoritos
 *       500:
 *         description: Erro ao remover produto dos favoritos
 */
router.post('/remove', favoriteController.removeFromFavorites);

module.exports = router;
