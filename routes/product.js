const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { check } = require('express-validator');
const upload = require('../db/middleware/multerConfig');

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Products
 *     summary: Ver página de produto por ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *         content:
 *           application/json:
 *             schema:
 *                  description: Dados do produto
 *       404:
 *         description: Produto não encontrado.
 */
router.get('/', productController.getProduct);

router.post(
    '/',
    upload.single('productImage'),
/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *       - Products
 *     summary: Publicar produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               brand:
 *                 type: string
 *               ProductTypeId:
 *                 type: integer
 *               SizeId:
 *                 type: integer
 *               ColorId:
 *                 type: integer
 *               GradeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto publicado
 *         content:
 *           application/json:
 *             schema:
 *                  description: Produto publicado com sucesso
 *       400:
 *         description: Input inválido
 *       500:
 *         description: Erro ao publicar produto
 */
router.post(
    '/',
    [
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    productController.publishProduct
);

router.put(
    '/',
    upload.single('productImage'),
/**
 * @swagger
 * /product:
 *   put:
 *     tags:
 *       - Products
 *     summary: Editar produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - title
 *               - description
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               brand:
 *                 type: string
 *               ProductTypeId:
 *                 type: integer
 *               SizeId:
 *                 type: integer
 *               ColorId:
 *                 type: integer
 *               GradeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *                  description: Produto atualizado com sucesso
 *       400:
 *         description: Input Inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao editar produto
 */
router.put(
    '/',
    [
        check('id').isInt().withMessage('Product ID must be an integer'),
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    productController.editProduct
);

/**
 * @swagger
 * /product:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Apagar produto
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto apagado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao apagar produto
 */
router.delete('/', productController.deleteProduct);

/**
 * @swagger
 * /product/form:
 *   get:
 *     tags:
 *       - Products
 *     summary: Dados para formulário de publicação
 *     responses:
 *       200:
 *         description: Dados para formulário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sizes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/form', productController.getForm);

/**
 * @swagger
 * /product/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Pesquisa de produtos
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome do produto
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         required: false
 *         description: Tamanho do produto
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         required: false
 *         description: Cor do produto
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Categoria do produto
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         required: false
 *         description: Marca do produto
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Lista ordenada por...
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Ordem da lista
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
 *         description: Erro ao pesquisar produtos
 */
router.get('/search', productController.searchProducts);

module.exports = router;
