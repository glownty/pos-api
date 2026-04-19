const CRS = require('../services/cashRegisterService')

exports.getAllCashRegisters = async (req, res) => {
    try{
        return res.json(await CRS.getAllRegisters(req.user.id))
    }catch (err){
        res.status(500).send({error: err});
    }
}