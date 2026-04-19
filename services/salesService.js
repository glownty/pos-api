const AppError = require("../utils/AppError");
const salesRepo = require("../repositories/salesRepository");

exports.createSale = async (
    userId,
    subtotal,
    discount,
    total,
    paymentMethod,
    status,
    products
) => {

    if (!userId || total == null) {
        throw new AppError('userId and total are required');
    }

    if (!Array.isArray(products) || products.length < 1) {
        throw new AppError('Invalid products');
    }

    const saleId = await salesRepo.createSale(
        userId,
        subtotal,
        discount,
        total,
        paymentMethod,
        status,
        products
    );

    return { msg: 'Created sale', saleId };
};

exports.getAllSales = async (userId) => {
    if (!userId) {
        throw new AppError('userId is required');
    }

    return await salesRepo.getAllSales(userId);
};

exports.getSaleById = async (id, userId) => {

    const sale = await salesRepo.getSaleById(id, userId);

    if (!sale) {
        throw new AppError('Sale not found');
    }

    return sale;
};

exports.updateSale = async (
    id,
    userId,
    subtotal,
    discount,
    total,
    paymentMethod,
    status
) => {

    if (!id || !userId) {
        throw new AppError('id and userId are required');
    }

    if (total == null) {
        throw new AppError('total is required');
    }

    await salesRepo.updateSale(
        id,
        userId,
        subtotal,
        discount,
        total,
        paymentMethod,
        status
    );

    return { msg: 'Updated sale' };
};

exports.deleteSale = async (id, userId) => {
    const sale = await salesRepo.getSaleById(id, userId);

    if (!sale) {
        throw new AppError('Sale not found');
    }

    await salesRepo.deleteSale(id, userId);

    return { msg: 'Deleted sale' };
};