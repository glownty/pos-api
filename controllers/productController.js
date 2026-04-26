const productService = require('../services/productService');

exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.user.id);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProductByBarcode = async (req, res, next) => {
    try {
        const barcode = req.params.code;
        const userId = req.user.id;

        const result = await productService.getProductByBarcode(barcode, userId);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProductByName = async (req, res, next) => {
    try {
        const name = req.query.name;
        const userId = req.user.id;

        const result = await productService.getProductByName(name, userId);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const result = await productService.getProductById(id, userId);
        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await productService.createProduct({
            userId,
            ...req.body
        });

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const result = await productService.updateProduct({
            id,
            userId,
            ...req.body
        });

        return res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        await productService.deleteProduct(id, userId);

        return res.json({ success: true });
    } catch (err) {
        next(err);
    }
};