const db = require('../config/db')

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

exports.createClient = async (name, phone, cpf, credit_limit, userId) => {
    const [result] = await db.execute('INSERT INTO clients (name, phone, cpf, credit_limit, user_id) VALUES (?,?,?,?, ?)',
        [name, phone, cpf, credit_limit,userId]
    )
    return result.insertId
}