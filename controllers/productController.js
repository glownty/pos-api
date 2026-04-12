const productService = require('../services/productService');

exports.getAllProducts = async (req,res) => {
    try {
        return res.json( await productService.getAllProducts(req.user.id));
    }catch (err){
        res.status(400).send({error: err});
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
    }catch(err) {
        return res.status(500).json({msg: 'Server error'});
    }
}
exports.updateProduct = async (req, res) => {
    const {
        id, name, barcode, price, cost, stock, categoryId, isActive,
    } = req.body;
    try {
        await productService.updateProduct({id, name, barcode, price, cost, stock, categoryId, isActive,})
    }catch (err){
        res.status(500).send({error: err});
    }
}

exports.deleteProduct = async (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(404).send({error: 'product not found'});
    }

    try {
        await productService.deleteProduct(id, req.user.id);
    }catch (err){
        res.status(500).send({error: err});
    }
}