const CS = require('../services/clientsService')

exports.getAllClients = async (req, res, next) => {
    const userId = req.user.id

    try{
        const result = await CS.getAllClients(userId)
        return res.json(result)
    }catch(err){
        next(err)
    }
}