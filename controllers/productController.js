const productService = require('../services/productService');

exports.getAllProducts = async (req,res) => {
    try {
        return res.json( await productService.getAllProducts(req.user.id));
    }catch (err){
        res.status(400).send({error: err});
    }
}

exports.getProductByBarcode = async (req,res) => {
    const barcode = req.params.code;
    const userId = req.user.id;

    if (!barcode) {
        return res.status(400).send({error: 'invalid barcode '});
    }
    try{
        const result = await productService.getProductByBarcode(barcode, userId);
        return res.json(result)
    }catch (err) {
        console.error("🔥 CREATE PRODUCT ERROR:", err);
        return res.status(500).json({
            msg: "Server error",
            error: err.message
        });
    }
}

exports.getProductByName = async (req,res) => {
    const name = req.query.name
    const userId = req.user.id;

    try{
        const result = await productService.getProductByName(name, userId);
        return res.json(result)
    }catch (err) {
        console.error("search product error:", err);
        return res.status(500).json({
            msg: "Server error",
            error: err.message
        });
    }
}

exports.createProduct = async (req, res) => {
    const {
        name, barcode, price, cost, stock, categoryId, isActive,
    } = req.body;

    const userId = req.user.id;
    try {
        const result = await productService.createProduct({
            userId, name, barcode, price, cost, stock, categoryId, isActive,
        });
        return res.json(result);
    }catch (err) {
        console.error("🔥 CREATE PRODUCT ERROR:", err);
        return res.status(500).json({
            msg: "Server error",
            error: err.message
        });
    }
}
exports.updateProduct = async (req, res) => {
    const {
        name, barcode, price, cost, stock, categoryId, isActive,
    } = req.body;
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const result = await productService.updateProduct({id, userId, name, barcode, price, cost, stock, categoryId, isActive,})
        return res.json(result);
    }catch (err) {
        console.error("🔥 PRODUCT ERROR:", err);

        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }
}

exports.deleteProduct = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;
    if (!id) {
        return res.status(404).send({error: 'product not found'});
    }
    if (!userId) {
        return res.status(400).send({error: 'undefined userId'});
    }

    try {
        await productService.deleteProduct(id, req.user.id);
    }catch (err) {
        console.error("🔥 ERROR:", err);

        return res.status(500).json({
            msg: "Server error",
            error: err.message,
            stack: err.stack // pode remover depois
        });
    }
}