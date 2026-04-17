const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authToken = require('../middlewares/authenticateToken');

router.get('/', authToken, productController.getAllProducts);
router.get('/search', authToken, productController.getProductByName);
router.get('/barcode/:code', authToken, productController.getProductByBarcode);
router.get('/:id', authToken, productController.getProductById);
router.post('/', authToken, productController.createProduct);
router.put('/:id', authToken, productController.updateProduct);
router.delete('/:id', authToken, productController.deleteProduct);

module.exports = router;