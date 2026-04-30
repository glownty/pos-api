const CRR = require('../repositories/cashRegisterRepository')
const AppError = require('../utils/AppError')

const ensureCashRegisterOpen = async (req, res, next) => {

    if(!req.user){
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID')
    }

    const cashStatus = await CRR.getCashRegisterStatus(req.user.id)


    if(!cashStatus){
        throw new AppError('Cash register not found', 404, null, 'CASH_REGISTER_NOT_FOUND')
        }
    if(cashStatus == "CLOSED"){
        throw new AppError('Cash Register is closed', 409, "The cash register is closed. Open a cash register before making sales.", 'CASH_REGISTER_IS_CLOSED')
    }

    next();

}

module.exports = ensureCashRegisterOpen;