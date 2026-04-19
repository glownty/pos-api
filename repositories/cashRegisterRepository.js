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








