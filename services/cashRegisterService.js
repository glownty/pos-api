const CRR = require('../repositories/cashRegisterRepository');
const CMR = require('../repositories/cashMovimentsRepository');
const AppError = require('../utils/AppError');

exports.getAllCashRegisters = async (userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    return await CRR.getAllCashRegisters(userId);
};
exports.getCashRegister = async (userId, page = 1, limit = 10) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }
    const p = Number(page) || 1;
    const l = Number(limit) || 10;

    const offset = (p - 1) * l;;

    const data = await CRR.getCashRegister(userId, limit, offset)
    const total  = await CRR.countCashRegister(userId)

    return{
        data,
        page,
        limit,
        total
    }
}
exports.getCashRegisterStatus = async (userId) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    const status = await CRR.getCashRegisterStatus(userId);

    if (!status) {
        throw new AppError(
            'Failed to retrieve cash register status',
            500,
            null,
            'CASH_REGISTER_STATUS_ERROR'
        );
    }

    return status;
};

exports.createAdjustment = async (userId, cashRegisterId, amount, description) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!cashRegisterId) {
        throw new AppError('Invalid cash register id', 400, null, 'INVALID_CASH_REGISTER_ID');
    }

    if (amount === undefined || amount === null) {
        throw new AppError('Invalid amount', 400, null, 'INVALID_AMOUNT');
    }

    if (!description || description.length < 3) {
        throw new AppError(
            'Invalid description',
            400,
            { field: 'description', error: 'Minimum 3 characters' },
            'INVALID_DESCRIPTION'
        );
    }

    return await CRR.createMovement(
        userId,
        cashRegisterId,
        "adjustment",
        amount,
        description
    );
};

exports.openCashRegister = async (userId, initialBalance) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    initialBalance = initialBalance ?? 0;

    return await CRR.openCashRegister(userId, initialBalance);
};

exports.closeCashRegister = async (finalBalance, userId, id) => {
    if (!userId) {
        throw new AppError('Invalid user id', 400, null, 'INVALID_USER_ID');
    }

    if (!id) {
        throw new AppError('Invalid id', 400, null, 'INVALID_ID');
    }

    if (finalBalance === undefined || finalBalance === null) {
        throw new AppError('Invalid final balance value', 400, null, 'INVALID_FINAL_BALANCE');
    }

    const cashRegister = await CRR.getCashRegisterById(id, userId);

    if (!cashRegister) {
        throw new AppError('Cash register not found', 404, null, 'CASH_REGISTER_NOT_FOUND');
    }

    const inMoviments = await CMR.getMovementsByType(id, "in");
    const outMoviments = await CMR.getMovementsByType(id, "out");

    const totalIn = inMoviments.reduce((sum, m) => sum + m.amount, 0);
    const totalOut = outMoviments.reduce((sum, m) => sum + m.amount, 0);

    const initialBalance = cashRegister.initial_balance;
    const expectedBalance = initialBalance + totalIn - totalOut;

    const success = await CRR.closeCashRegister(finalBalance, userId, id);

    return {
        success,
        finalBalance,
        expectedBalance,
        difference: finalBalance - expectedBalance
    };
};