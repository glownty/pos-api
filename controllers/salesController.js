const salesService = require('../services/salesService');

exports.getAllSales = async (req, res) => {
    const { userId } = req.user.id;

    try {
        return res.json(await salesService.getAllSales(userId));
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
};

exports.getSaleById = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const sale = await salesService.getSaleById(id, userId);
        return res.json(sale);
    } catch (err) {
        return res.status(404).send({ error: err.message });
    }
};

exports.createSale = async (req, res) => {
    const {
        userId,
        subtotal,
        discount,
        total,
        paymentMethod,
        status,
        products
    } = req.body;

    try {
        const result = await salesService.createSale(
            userId,
            subtotal,
            discount,
            total,
            paymentMethod,
            status,
            products
        );

        return res.json(result);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

exports.updateSale = async (req, res) => {
    const { id, userId } = req.params;

    const {
        subtotal,
        discount,
        total,
        paymentMethod,
        status
    } = req.body;

    try {
        const result = await salesService.updateSale(
            id,
            userId,
            subtotal,
            discount,
            total,
            paymentMethod,
            status
        );

        return res.json(result);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

exports.deleteSale = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const result = await salesService.deleteSale(id, userId);
        return res.json(result);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};