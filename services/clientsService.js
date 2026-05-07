const CR = require('../repositories/clientsRepository')
const AppError = require('../utils/AppError');

exports.getAllClients = async (userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    return CR.getAllClients(userId);
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
