const db = require('../config/db')

exports.getMovementsByCashRegisterId = async (cashRegisterId) =>{
    const [result] = await db.execute(
        'SELECT * FROM cash_movements WHERE cash_register_id = ? ',
        [cashRegisterId]
    )
    return result
}
exports.getMovementsByType = async (id, type) =>{
    const [result] = await db.execute(
        'SELECT * FROM cash_movements WHERE cash_register_id = ? AND type = ? ORDER BY created_at ASC',
        [id, type]
    )
    return result
}