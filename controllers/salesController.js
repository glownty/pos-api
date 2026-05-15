const salesService = require('../services/salesService');

exports.getAllSales = async (req, res, next) => {
    try {
        const result = await salesService.getAllSales(req.user.id);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getSaleById = async (req, res, next) => {
    try {
        const sale = await salesService.getSaleById(
            req.params.id,
            req.user.id
        );

        return res.json(sale);
    } catch (err) {
        next(err);
    }
};

exports.createSale = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            subtotal,
            discount = 0, 
            paymentMethod = "cash", 
            status = "completed",
            products
        } = req.body;

        const result = await salesService.createSale(
            userId,
            subtotal,
            discount,
            subtotal - discount,
            paymentMethod,
            status,
            products
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateSale = async (req, res, next) => {
    try {
        const result = await salesService.updateSale(
            req.params.id,
            req.user.id,
            req.body.subtotal,
            req.body.discount,
            req.body.total,
            req.body.paymentMethod,
            req.body.status
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteSale = async (req, res, next) => {
    try {
        const result = await salesService.deleteSale(
            req.params.id,
            req.user.id
        );

        return res.json(result);
    } catch (err) {
        next(err);
    }
};