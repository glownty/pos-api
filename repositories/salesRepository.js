const db = require("../config/db");
const saleItemRepo = require("../repositories/saleItensRepository");

exports.createSale = async (userId, subtotal, discount, total, paymentMethod, status, products)=>{

    if (!Array.isArray(products) || products.length < 1) {
        throw new Error(`Invalid products`);
    }
    const [result] = await db.execute('INSERT INTO sales (userId, subtotal, discount, total, paymentMethod, status) VALUES (?,?,?,?,?,?)', [userId, subtotal, discount, total, paymentMethod, status])
    const saleId = result.insertId

    try{
        await saleItemRepo.addProductsInSale(products, saleId)
    }catch (err){
        await db.execute('DELETE FROM sales WHERE id = ?', [saleId])
        throw err
    }

    return saleId;
}

exports.updateSale = async (id, userId, subtotal, discount, total, paymentMethod, status)=>{
    await db.execute('UPDATE sales SET subtotal = ?, discount = ?, total = ?, paymentMethod = ?, status = ? WHERE id = ? and userId = ?', [subtotal, discount, total, paymentMethod, status, id, userId])
}

exports.deleteSale = async (id, userId)=>{
    await db.execute('DELETE FROM sales WHERE id = ? AND userId = ?', [id, userId]);
}
exports.getAllSales = async (userId) => {
    const [sales] = await db.execute(
        'SELECT * FROM sales WHERE userId = ?',
        [userId]
    );

    const result = await Promise.all(
        sales.map(async (sale) => {
            const [items] = await db.execute(`
                SELECT 
                    si.productId,
                    si.quantity,
                    si.price,
                    p.name AS productName
                FROM saleitens si
                JOIN products p ON p.id = si.productId
                WHERE si.saleId = ?
            `, [sale.id]);

            return {
                ...sale,
                items: items
            };
        })
    );

    return result;
};
exports.getSaleById = async (id, userId) => {

    const [saleRows] = await db.execute(
        'SELECT * FROM sales WHERE id = ? AND userId = ?',
        [id, userId]
    );

    const sale = saleRows[0];

    if (!sale) return null;

    const [items] = await db.execute(`
        SELECT
            si.productId,
            si.quantity,
            si.price,
            p.name AS productName,
            (si.quantity * si.price) AS subtotal
        FROM saleItens si
                 JOIN products p ON p.id = si.productId
        WHERE si.saleId = ?
    `, [id]);

    return {
        ...sale,
        items
    };
};