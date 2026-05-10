const db = require('../config/db')


exports.createClient = async (name, phone, cpf, credit_limit, userId) => {
    const [result] = await db.execute(
        'INSERT INTO clients (name, phone, cpf, credit_limit, user_id) VALUES (?,?,?,?, ?)',
        [name, phone, cpf, credit_limit,userId]
    )
    return result.insertId
}

exports.deleteClient = async (clientId, userId) => {
    const [result] = await db.execute(
        'DELETE FROM clients WHERE id = ? AND user_id =?',
        [clientId, userId]
    )
    return result
}

exports.countClients = async (userId) => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) as total 
         FROM clients
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0].total;
};

//=======================================================
//                  UPDATE FUNCTIONS
//=======================================================

exports.updateClient = async (name, phone, cpf, credit_limit, debt, userId, clientId) =>{
    const [result] = await db.execute(
    'UPDATE clients SET name = ?, phone = ?, cpf = ?, credit_limit = ?, debt = ? WHERE user_id = ? AND id = ?',
    [name, phone, cpf, credit_limit, debt, userId, clientId])
    return result
}

exports.changeDebt = async (debt, clientId, userId) => {
    const [result] = await db.execute(
        `UPDATE clients
         SET debt = debt + ?
         WHERE id = ? AND user_id = ?`,
        [debt, clientId, userId]
    )

    return result
}

exports.setDebt = async (debt, clientId, userId) => {
    const [result] = await db.execute(
        'UPDATE clients SET debt = ? WHERE user_id = ? AND id = ?',
        [debt, userId, clientId]
    )
    return result
}
//=======================================================
//                   GET FUNCTIONS
//=======================================================
exports.getAllClients = async (userId) => {
    const [rows] = await db.execute(`
        SELECT
            cl.id,
            cl.name,
            cl.phone,
            cl.cpf,
            cl.credit_limit,
            cl.debt,
            cl.created_at
        FROM clients cl
        WHERE cl.user_id = ?
        ORDER BY cl.id DESC
    `, [userId]);

    return rows;
};

exports.getClients = async (userId, limit, offset) => {
        const safeLimit = Number(limit);
        const safeOffset = Number(offset);
        const safeUserId = Number(userId);

        if (!Number.isFinite(safeLimit) || !Number.isFinite(safeOffset)) {
            throw new Error("Invalid pagination values");
        }
        const [rows] = await db.execute(
            `SELECT * FROM clients
             WHERE user_id = ?
             ORDER BY id DESC
                 LIMIT ${safeLimit} OFFSET ${safeOffset}`,
            [safeUserId]
        );

        return rows;
};

exports.getClientById = async (clientId, userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM clients WHERE id = ? AND user_id = ?',
        [clientId, userId]
    )
    return rows
}

exports.getClientByName = async (userId, name) => {
    const [rows] = await db.execute(
        'SELECT * FROM clients WHERE user_id = ? AND name like ? order by name like ? desc, name asc',
        [userId, `%${name}%`, `${name}%`]
    )
    return rows
}

