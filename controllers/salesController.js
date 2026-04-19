const salesService = require('../services/salesService');

exports.getAllSales = async (req, res) => {
    const userId  = req.user.id;

    try {
        return res.json(await salesService.getAllSales(userId));
    } catch (err) {
        return res.status(400).send({ error: err.message });
    }
};

exports.getSaleById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const sale = await salesService.getSaleById(id, userId);
        return res.json(sale);
    } catch (err) {
        return res.status(404).send({ error: err.message });
    }
};

exports.createSale = async (req, res) => {
    const {
        subtotal,
        discount,
        paymentMethod,
        status,
        products
    } = req.body;
    const userId = req.user.id;
    try {
        const result = await salesService.createSale(
            userId,
            subtotal,
            discount || 0,
            subtotal - discount,
            paymentMethod || "cash",
            status || "completed",
            products
        );

        return res.json(result);
    } catch (err) {
        console.error("🔥 SALES ERROR FULL:");
        console.error(err);
        console.error("STACK:");
        console.error(err.stack);

        return res.status(500).json({
            message: err.message,
            name: err.name,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
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