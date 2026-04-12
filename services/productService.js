const AppError = require("../utils/AppError");
const productRepo = require("../repositories/productRepository");

exports.createProduct = async (data) => {
    const { userId, name, barcode, price, cost, stock, categoryId, isActive } = data;

    if (!name || price == null) {
        throw new AppError('name and price is required');
    }

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

exports.updateProduct = async (
    id,
    name,
    barcode,
    price,
    cost,
    stock,
    categoryId,
    isActive
) => {
    if (!name || price==null) {
        throw new AppError('name and price is required');
    }
    if (await productRepo.getProductByBarcode(barcode)){
        throw new AppError('barcode already exists');
    }
    await productRepo.updateProduct(id, name,barcode, price, cost, stock, categoryId, isActive);
    return{msg: 'Updated product'};
}
exports.deleteProduct = async (id, userId) => {
    const product = await productRepo.getProductById(id, userId)
    if(!product){
        throw new AppError('product not found');
    }
    await productRepo.deleteProduct(id);
    return productRepo.getAllProducts();
}