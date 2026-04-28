const CRS = require('../services/cashRegisterService');

exports.getAllCashRegisters = async (req, res, next) => {
    try {
        const result = await CRS.getAllCashRegisters(req.user.id);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getCashRegister = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let { page, limit } = req.query;

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        if (page <= 0) {page = 1}
        if (limit <= 0) {limit = 10}
        if (limit > 100) {limit = 100}

        const result = await CRS.getCashRegister(
            userId,
            page,
            limit
        );

        return res.json(result);
    }catch(err) {
        next(err);
    }
}

exports.createAdjustment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cashRegisterId = req.params.id;
        const { amount, description } = req.body;

        const result = await CRS.createAdjustment(
            userId,
            cashRegisterId,
            amount,
            description
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.openCashRegister = async (req, res, next) => {
    try {
        const { initialBalance } = req.body;

        const result = await CRS.openCashRegister(
            req.user.id,
            initialBalance
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.closeCashRegister = async (req, res, next) => {
    try {
        const { finalBalance } = req.body;
        const id = req.params.id;
        const userId = req.user.id;

        const result = await CRS.closeCashRegister(
            finalBalance,
            userId,
            id
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};