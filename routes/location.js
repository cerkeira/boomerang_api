const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location');

/**
 * @swagger
 * /location:
 *   put:
 *     tags:
 *       - Locations
 *     summary: Editar morada existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - address
 *             properties:
 *               id:
 *                 type: integer
 *               address:
 *                 type: string
 *               locationName:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Morada atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Input inváldio
 *       404:
 *         description: Morada não encontrada
 *       500:
 *         description: Erro ao editar morada
 */
router.put('/', locationController.editLocation);

/**
 * @swagger
 * /location:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Mostrar moradas do utilizador
 *     responses:
 *       200:
 *         description: Lista de moradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       500:
 *         description: Erro ao procurar moradas
 */
router.get('/', locationController.listUserLocations);

/**
 * @swagger
 * /location:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Adicionar morada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *               locationName:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Morada adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Input inválido
 *       500:
 *         description: Erro ao adicionar morada
 */
router.post('/', locationController.addLocation);

/**
 * @swagger
 * /location:
 *   delete:
 *     tags:
 *       - Locations
 *     summary: Apagar morada por ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da morada a apagar
 *     responses:
 *       200:
 *         description: Morada apagada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Morada não encontrada
 *       500:
 *         description: Erro ao apagar morada
 */
router.delete('/', locationController.deleteLocation);

module.exports = router;
