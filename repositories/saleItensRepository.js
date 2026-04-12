const db = require('../config/db')

exports.addProductsInSale = async (products, saleId) => {
    const values = products.map(item => [saleId, item.id, item.quantity]);

    await db.query(
        'INSERT INTO saleItens (saleID, productId, quantity) VALUES ?',
        [values]
    );
};