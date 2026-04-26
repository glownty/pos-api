const AppError = require("../utils/AppError");
const productRepo = require("../repositories/productRepository");

exports.createProduct = async (data) => {
    let {
        userId,
        name,
        barcode,
        price,
        cost,
        stock,
        categoryId,
        isActive
    } = data;

    if (!name || price == null) {
        throw new AppError('name and price is required');
    }

    // 🔥 AQUI É O FIX
    barcode = barcode ?? null;
    cost = cost ?? 0;
    stock = stock ?? 0;
    categoryId = categoryId ?? null;
    isActive = isActive ?? true;

    await productRepo.createProduct(
        userId,
        name,
        barcode,
        price,
        cost,
        stock,
        categoryId,
        isActive
    );

    return { msg: 'Created product' };
};

exports.getAllProducts = async (userId) => {
    return productRepo.getAllProducts(userId);
}
exports.getProductById = async (id, userId) => {
    return productRepo.getProductById(id, userId);
}
exports.getProductByBarcode = async (barcode, userId) => {
    return productRepo.getProductByBarcode(barcode, userId);
}
exports.getProductByName = async (name, userId) => {
    if (!name || !name.trim()) {
        return [];
    }
    if (!userId) {
        throw new AppError('userId is invalid');
    }
    const clean = name.trim();

    if (clean.length > 50) {
        throw new AppError('search too long');
    }
    if (clean.length < 2) {
        return [];
    }
    return productRepo.getProductByName(name, userId);
}
exports.updateProduct = async ({
                                   id,
                                   userId,
                                   name,
                                   barcode,
                                   price,
                                   cost,
                                   stock,
                                   categoryId,
                                   isActive
                               }) => {

    if (!name || price == null) {
        throw new AppError('name and price is required');
    }

    if (barcode) {
        const existing = await productRepo.getProductByBarcode(barcode, userId);

        if (existing.length && existing[0].id != id) {
            throw new AppError('barcode already exists');
        }
    }

    await productRepo.updateProduct(
        id,
        userId,
        name,
        barcode,
        price,
        cost,
        stock,
        categoryId,
        isActive
    );

    return await productRepo.getAllProducts(userId);
};
exports.deleteProduct = async (id, userId) => {
    const product = await productRepo.getProductById(id, userId)
    if(!product){
        throw new AppError('product not found');
    }
    await productRepo.deleteProduct(id, userId);
    return productRepo.getAllProducts();
}