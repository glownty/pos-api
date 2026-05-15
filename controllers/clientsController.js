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
        const result = await CS.createClient(name, phone, cpf, credit_limit, req.user.id)
        return res.json(result)
    }catch(err){
        next(err)
    }
}

exports.getClients = async (req, res, next) => {
    const userId = req.user.id;
    let { page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    if (page <= 0) {page = 1}
    if (limit <= 0) {limit = 10}
    if (limit > 100) {limit = 100}

    try{
        const result = await CS.getClients(userId, page, limit)
        return res.json(result)
    }catch(err){
        next(err)
    }

}
exports.changeDebt = async (req, res, next) => {
    const debt = req.body;
    const userId = req.user.id;
    const clientId = req.params;
    
    try{
        const result = await CS.changeDebt(debt, clientId, userId)
        return res.json(result)
    }catch(err){
        next(err)
    }
}
exports.setDebt = async (req, res, next) => {
    const debt = req.body;
    const userId = req.user.id;
    const clientId = req.params;
    
    try{
        const result = await CS.setDebt(debt, clientId, userId)
        return res.json(result)
    }catch(err){
        next(err)
    }
}
exports.deleteClient = async (req, res, next) => {
    const clientId = req.params;
    const userId = req.user.id;

    try{
        const result = await CS.deleteClient(userId, clientId)
        return res.json(result)
    }catch(err){
        next(err)
    }

}
exports.getClientById = async (req, res, next) => {
    const clientId = req.params;
    const userId = req.user.id

    try{

        const result = await CS.getClientById(clientId, userId)
        return res.json(result)
    }catch(err){
        next(err)
    }
}
}
exports.updateClient = async (req, res, next) => {

}
exports.getClientByName = async (req, res, next) => {

}