const CRS = require('../services/cashRegisterService')

exports.getAllCashRegisters = async (req, res) => {
    try{
        return res.json(await CRS.getAllCashRegisters(req.user.id))
    }catch (err) {
        console.error("❌ CASHREGISTER ERROR:", err);

        res.status(500).json({
            message: "Erro interno no servidor",
            error: err.message || "Erro desconhecido"
        });
    }
}

exports.openCashRegister = async (req, res) => {
    const {initialBalance} = req.body
    try{
        return res.json(await CRS.openCashRegister(req.user.id, initialBalance))
    }catch (err){
        res.status(500).send({error: err});
    }
}
exports.closeCashRegister = async (req, res) => {
    const { finalBalance } = req.body
    const id = req.params.id
    const userId = req.user.id
    try {
        return res.json(await CRS.closeCashRegister(finalBalance, userId, id))
    }catch (err) {
        console.error("❌ CLOSE CASH ERROR:");
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);

        res.status(500).json({
            message: err.message || "Erro interno no servidor"
        });
    }
}