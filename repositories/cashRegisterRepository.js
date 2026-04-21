const db = require('../config/db')

exports.getAllCashRegisters = async (userId) => {
    const [rows] = await db.execute(`
        SELECT
            cr.id,
            cr.opened_at,
            cr.closed_at,
            cr.initial_balance,
            cr.status,
            cm.id AS movement_id,   
            cm.type,
            cm.amount,
            cm.description,
            cm.created_at
        FROM cash_register cr
        LEFT JOIN cash_movements cm
            ON cm.cash_register_id = cr.id
        WHERE cr.user_id = ?
        ORDER BY cr.id DESC
    `, [userId]);

    return rows;
};

exports.openCashRegister = async (userId, initialBalance) => {
    const [result] = await db.execute(
        'INSERT INTO cash_register (user_id, initial_balance) VALUES (?, ?)',
        [userId, initialBalance])
    return result.insertId
}

exports.closeCashRegister = async (finalBalance, userId, id) => {
    const [result] = await eb.execute(
        'UPDATE cash_register SET closed_at = NOW(), status = "closed", final_balance = ? WHERE user_id = ? AND id = ? AND status = "open"',
        [finalBalance, userId, id]
    )
    return result.affectedRows;
}



