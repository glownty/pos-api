const db = require('../config/db')

exports.getMovementsByCashRegisterId = async (cashRegisterId, userId) =>{
    const [result] = await db.execute(
        'SELECT * FROM cash_movements WHERE cash_register_id = ? AND user_id = ?',
        [cashRegisterId, userId]
    )
    return result
}
exports.getMovementsByType = async (id, userId, type) =>{
    const [result] = await db.execute(
        'SELECT * FROM cash_movements WHERE cash_register_id = ? AND user_id = ? AND type = ? ORDER BY created_at ASC',
        [id, userId, type]
    )
    return result
}