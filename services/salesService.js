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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (total == null) {
        throw new AppError('Total is required', 400, null, 'INVALID_TOTAL');
    }

    if (!Array.isArray(products) || products.length < 1) {
        throw new AppError(
            'Invalid products',
            400,
            { field: 'products', error: 'Must contain at least 1 item' },
            'INVALID_PRODUCTS'
        );
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
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    return await salesRepo.getAllSales(userId);
};

exports.getSaleById = async (id, userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid sale id', 400, null, 'INVALID_SALE_ID');
    }

    const sale = await salesRepo.getSaleById(id, userId);

    if (!sale) {
        throw new AppError('Sale not found', 404, null, 'SALE_NOT_FOUND');
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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid sale id', 400, null, 'INVALID_SALE_ID');
    }

    if (total == null) {
        throw new AppError('Total is required', 400, null, 'INVALID_TOTAL');
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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid sale id', 400, null, 'INVALID_SALE_ID');
    }

    const sale = await salesRepo.getSaleById(id, userId);

    if (!sale) {
        throw new AppError('Sale not found', 404, null, 'SALE_NOT_FOUND');
    }

    await salesRepo.deleteSale(id, userId);

    return { msg: 'Deleted sale' };
};