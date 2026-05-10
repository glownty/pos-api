const CR = require('../repositories/clientsRepository')
const AppError = require('../utils/AppError');

exports.getAllClients = async (userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    return CR.getAllClients(userId);
}

exports.getClients = async (userId, page = 1, limit = 10) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    const p = Number(page) || 1;
    const l = Number(limit) || 10;

    const offset = (p - 1) * l;;

    const data = await CR.getClients(userId, limit, offset)
    const total  = await CR.countClients(userId)

    return{
        data,
        page,
        limit,
        total
    }
}
exports.changeDebt = async (debt, clientId, userId) => {
    if (!Number(userId)) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!Number(clientId)) {
        throw new AppError('Invalid client id', 400, null, 'INVALID_CLIENT_ID');
    }
    if (!Number(debt)) {
        throw new AppError('Invalid debt value', 400, null, 'INVALID_DEBT_VALUE');
    }
    
    return CR.changeDebt(debt, clientId, userId)
}
exports.setDebt = async (debt, clientId, userId) => {
    if (!Number(userId)) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!Number(clientId)) {
        throw new AppError('Invalid client id', 400, null, 'INVALID_CLIENT_ID');
    }
    if (!Number(debt)) {
        throw new AppError('Invalid debt value', 400, null, 'INVALID_DEBT_VALUE');
    }
    
    return CR.setDebt(debt, clientId, userId)
}
exports.deleteClient = async (userId, clientId) => {
    if (!Number(userId)) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!Number(clientId)) {
        throw new AppError('Invalid client id', 400, null, 'INVALID_CLIENT_ID');
    }

    return CR.deleteClient(clientId, userId)
}
exports.getClientById = async (clientId, userId) => {
    if (!Number(userId)) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!Number(clientId)) {
        throw new AppError('Invalid client id', 400, null, 'INVALID_CLIENT_ID');
    }

    return CR.getClientById(clientId, userId)
}
exports.getClientByName = async (name, userId) => {
    if (!Number(userId)) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!name) {
        throw new AppError('Invalid client name', 400, null, 'INVALID_CLIENT_NAME');
    }

    return CR.getClientByName(name, userId)
}
exports.createClient = async (name, phone, cpf = null, credit_limit = 0, userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    if (!name){
        throw new AppError('Invalid name', 400, null, 'INVALID_NAME');
    }
    if (!phone){
        throw new AppError('Invalid phone', 400, null, 'INVALID_PHONE');
    }
    if(isNaN(phone)){
        throw new AppError('phone must be number', 400, null, 'INVALID_PHONE');
    }

    
    return CR.createClient(name, phone, cpf, credit_limit, userId)
}
exports.updateClient = async (name, phone, cpf, credit_limit, debt, userId, clientId) => {
    const client = await CR.getClientById(clientId)

    const updatedClient = {
        name: name ? name : client.name,
        phone: phone ? phone : client.phone,
        cpf: cpf ? cpf : client.cpf,

        credit_limit:
            credit_limit === null || credit_limit === undefined || credit_limit === ""
                ? client.credit_limit
                : credit_limit,

        debt:
            debt === null || debt === undefined || debt === ""
                ? client.debt
                : debt,

        userId: client.userId,
    }

    return CR.updateClient(
        updatedClient.name,
        updatedClient.phone,
        updatedClient.cpf,
        updatedClient.credit_limit,
        updatedClient.debt,
        userId,
        clientId
    )
}