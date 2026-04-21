const CRS = require('../services/cashRegisterService')

exports.getAllCashRegisters = async (req, res) => {
    try{
        return res.json(await CRS.getAllRegisters(req.user.id))
    }catch (err){
        res.status(500).send({error: err});
    }
}

exports.openCashRegister = async (req, res) => {
    const initialBalance = req.body
    try{
        return res.json(await CRS.openCashRegister(req.user.id, initialBalance))
    }catch (err){
        res.status(500).send({error: err});
    }
}
exports.closeCashRegister = async (req, res) => {
    const initialBalance = req.body
    const id = req.params.id
    try {
        return res.json(await CRS.closeCashRegister(initialBalance, userId, id))
    }catch (err){
        res.status(500).send({error: err});
    }
}