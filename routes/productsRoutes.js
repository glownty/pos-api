const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authToken = require('../middlewares/authenticateToken');

router.get('/products', productController.getAllProducts);
router.post('/products', authToken, productController.createProduct);
router.put('/products', authToken, productController.updateProduct);
router.delete('/products', productController.deleteProduct);


module.exports = router;