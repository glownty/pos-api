const CRR = require('../repositories/cashRegisterRepository')

exports.getAllCashRegisters = async (userId)=>{
    if(!userId){
        throw new Error('Invalid user id.');
    }
    return await CRR.getAllCashRegisters(userId);
}