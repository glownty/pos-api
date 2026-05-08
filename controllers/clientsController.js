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

exports.createClient = async (req, res, next) => {
    const {name, phone, cpf, credit_limit} = req.body
    try{
        const result = await CS.createClient(name, phone, cpf, credit_limit)
        return res.json(result)
    }catch(err){
        next(err)
    }
}