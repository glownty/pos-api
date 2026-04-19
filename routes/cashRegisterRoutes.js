const express = require('express');
const router = express.Router();
const CRC = require('../controllers/cashRegisterController');
const AT = require('../middlewares/authenticateToken')

router.get('/', AT, CRC.getAllCashRegisters);

module.exports = router;