const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const AT = require('../middlewares/authenticateToken');

router.get('/:userId', AT, salesController.getAllSales);
router.get('/:userId/:id',  AT, salesController.getSaleById);
router.post('/', AT, salesController.createSale);
router.put('/:userId/:id', AT, salesController.updateSale);
router.delete('/:userId/:id', AT, salesController.deleteSale);

module.exports = router;