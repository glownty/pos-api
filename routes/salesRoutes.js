const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

const AT = require('../middlewares/authenticateToken');
const ECRO = require('../middlewares/ensureCashRegisterOpen')

router.get('/', AT, salesController.getAllSales);
router.get('/:id',  AT, salesController.getSaleById);
router.post('/', AT, ECRO, salesController.createSale);
router.put('/:id', AT, salesController.updateSale);
router.delete('/:id', AT, salesController.deleteSale);

module.exports = router;