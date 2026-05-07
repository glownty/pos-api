const express = require('express');
const router = express.Router();
const AT = require('../middlewares/authenticateToken')
const CC = require('../controllers/clientsController')

router.get('/', AT, CC.getAllClients)

module.exports = router