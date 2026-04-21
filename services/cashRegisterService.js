const CRR = require('../repositories/cashRegisterRepository')
const CMR = require('../repositories/cashMovimentsRepository')

exports.getAllCashRegisters = async (userId)=>{
    if(!userId){
        throw new Error('Invalid user id.');
    }
    return await CRR.getAllCashRegisters(userId);
}

exports.openCashRegister = async (userId, initialBalance)=>{
    if(!userId){
        throw new Error('Invalid user id.');
    }
    initialBalance = initialBalance ?? 0;

    return await CRR.openCashRegister(userId, initialBalance);
}
exports.closeCashRegister = async (finalBalance, userId, id)=>{
    if(!userId){throw new Error('Invalid user id.');}
    if (!id){throw new Error ('Invalid id.');}
    if (finalBalance == undefined){throw new Error ('Invalid final balance value.');}

    const inMoviments = await CMR.getMovementByType(id, userId,"in");
    const outMoviments = await CMR.getMovementByType(id, userId,"out");

    const totalIn = inMoviments.reduce((sum, m) => sum + m.amount, 0);
    const totalOut = outMoviments.reduce((sum, m) => sum + m.amount, 0);

    const cashRegister = await CRR.getCashRegisterById(id, userId);
    const initialBalance = cashRegister.initial_balance;
    const expectedBalance = initialBalance + totalIn - totalOut;

    return {
        success: await CRR.closeCashRegister(finalBalance, userId, id),
        expectedBalance
    }
}