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