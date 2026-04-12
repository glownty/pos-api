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
exports.getAllSales = async (userId)=>{
    const [rows] = await db.execute('SELECT * FROM sales WHERE userId = ?', [userId]);
    return rows;
}
exports.getSaleById = async (id, userId)=>{
    const [rows] = await db.execute(
        'SELECT * FROM sales WHERE id = ? AND userId = ?',
        [id, userId]);
    const sale = rows[0];
    if (!sale) return null;

    const [items] = await db.execute(
        'SELECT * FROM saleItens WHERE saleId = ?',
        [id]
    );

    return {
        ...sale,
        items,
    }
}