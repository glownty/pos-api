const db = require('../config/db')

exports.getAllCashRegisters = async (userId) => {
    const [rows] = await db.execute(`
        SELECT
            cr.id,
            cr.opened_at,
            cr.closed_at,
            cr.initial_balance,
            cr.status,
            cr.final_balance
        FROM cash_register cr
        WHERE cr.user_id = ?
        ORDER BY cr.id DESC
    `, [userId]);

    return rows;
};

exports.getCashRegisterById = async (id, userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM cash_register WHERE user_id = ? AND id = ?',
        [userId, id]
    )
    return rows[0];
}

    exports.getCashRegister = async (userId, limit, offset) => {
        const safeLimit = Number(limit);
        const safeOffset = Number(offset);
        const safeUserId = Number(userId);

        if (!Number.isFinite(safeLimit) || !Number.isFinite(safeOffset)) {
            throw new Error("Invalid pagination values");
        }
        const [rows] = await db.execute(
            `SELECT * FROM cash_register
             WHERE user_id = ?
             ORDER BY id DESC
                 LIMIT ${safeLimit} OFFSET ${safeOffset}`,
            [safeUserId]
        );
        console.log("ROWS RETURNED:", rows.length);

        return rows;
    };
exports.countCashRegister = async (userId) => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) as total 
         FROM cash_register 
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0].total;
};

exports.openCashRegister = async (userId, initialBalance) => {
    const [result] = await db.execute(
        'INSERT INTO cash_register (user_id, initial_balance) VALUES (?, ?)',
        [userId, initialBalance])
    return result.insertId
}

exports.closeCashRegister = async (finalBalance, userId, id) => {
    const [result] = await db.execute(
        'UPDATE cash_register SET closed_at = NOW(), status = "CLOSED", final_balance = ? WHERE user_id = ? AND id = ? AND status = "OPEN"',
        [finalBalance, userId, id]
    )
    return result.affectedRows;
}



