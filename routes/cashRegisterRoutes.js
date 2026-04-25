const express = require('express');
const router = express.Router();
const CRC = require('../controllers/cashRegisterController');
const AT = require('../middlewares/authenticateToken')

router.get('/', AT, CRC.getAllCashRegisters);
router.post('/open', AT, CRC.openCashRegister);
router.post('/:id', AT, CRC.closeCashRegister);
router.post('/:id/adjustment', AT, CRC.createAdjustment)


module.exports = router;