const db = require('../config/db');

exports.createProduct = async (
    userId, name, barcode, price, cost, stock, categoryId, isActive )=>{
    await db.execute(
        'insert into products (userId, name, barcode, price, cost, stock, categoryId, isActive) values (?,?,?,?,?,?,?,? )', [userId, name, barcode, price, cost, stock, categoryId, isActive]);
}


exports.updateProduct = async (id, userId, name, barcode, price, cost, stock, categoryId, isActive)=>{
    await db.execute(
        `UPDATE products 
     SET name = ?, 
         barcode = ?,       
         price = ?, 
         cost = ?, 
         stock = ?, 
         categoryId = ?, 
         isActive = ?
     WHERE id = ? AND userId = ?`,
        [name, barcode, price, cost, stock, categoryId, isActive, id, userId]
    );
}
exports.deleteProduct = async (id, userId) => {
    console.log("🧨 DELETE PARAMS:", { id, userId });
    await db.execute(`DELETE FROM products WHERE id = ? AND userId = ?`, [id, userId]);
    return {msg: 'Deleted product'};
}
exports.getAllProducts = async (userId) => {
    const [rows] = await db.execute('SELECT * FROM products WHERE userId = ?', [userId]);
    return rows;
}
exports.getProductByBarcode = async (barcode, userId)=>{
    const [rows] = await db.execute(
        'select * from products where userId = ? and barcode = ?',
        [userId, barcode]);
    return rows;
}
exports.getProductById = async (id, userId) => {
    const [rows] = await db.execute(
        'select * from products where id = ? AND userId = ?',
        [id, userId]);
    return rows;
}
exports.getProductByName = async (name, userId) => {
    const [rows] = await db.execute(
        'select * from products where userId  = ? and name like ? order by name like ? desc, name asc',
        [userId, `%${name}%`, `${name}%`]);
    return rows;
}