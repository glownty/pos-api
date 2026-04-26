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

    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!name || price == null) {
        throw new AppError(
            'name and price is required',
            400,
            null,
            'VALIDATION_ERROR'
        );
    }

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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    return productRepo.getAllProducts(userId);
};

exports.getProductById = async (id, userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid product id', 400, null, 'INVALID_PRODUCT_ID');
    }

    return productRepo.getProductById(id, userId);
};

exports.getProductByBarcode = async (barcode, userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!barcode) {
        throw new AppError('Invalid barcode', 400, null, 'INVALID_BARCODE');
    }

    return productRepo.getProductByBarcode(barcode, userId);
};

exports.getProductByName = async (name, userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!name || !name.trim()) {
        return [];
    }

    const clean = name.trim();

    if (clean.length > 50) {
        throw new AppError('Search too long', 400, null, 'SEARCH_TOO_LONG');
    }

    if (clean.length < 2) {
        return [];
    }

    return productRepo.getProductByName(clean, userId);
};

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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid product id', 400, null, 'INVALID_PRODUCT_ID');
    }

    if (!name || price == null) {
        throw new AppError(
            'name and price is required',
            400,
            null,
            'VALIDATION_ERROR'
        );
    }

    if (barcode) {
        const existing = await productRepo.getProductByBarcode(barcode, userId);

        if (existing.length && existing[0].id != id) {
            throw new AppError(
                'barcode already exists',
                409,
                null,
                'BARCODE_ALREADY_EXISTS'
            );
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
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid product id', 400, null, 'INVALID_PRODUCT_ID');
    }

    const product = await productRepo.getProductById(id, userId);

    if (!product) {
        throw new AppError('Product not found', 404, null, 'PRODUCT_NOT_FOUND');
    }

    await productRepo.deleteProduct(id, userId);

    return await productRepo.getAllProducts(userId);
};