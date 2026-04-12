const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');
require('dotenv').config();

exports.register = async ({ username, password }) => {
    if (!username || !password) {
        throw new AppError('Username and password is required', 400);
    }
    if (username.length < 4 ) {
        throw new AppError('Username and password must be at least 4 characters');}
    if (password.length < 8 ) {
        throw new AppError('Password must be at least 8 characters');
    }
    const user = await userRepo.findByUsername(username);
    if (user) {
        throw new AppError(`User already registered`, 400);
    }
    await userRepo.createUser(username, password);
    return { msg: 'successfully registered' };
}

exports.login = async ({ username, password }) => {
    if (!username || !password) {throw new AppError('Username and password is required', 400);}

    const user = await userRepo.findByUsername(username);
    if (!user) {throw new AppError(`User or password is invalid.`, 400);}
    if (!bcrypt.compareSync(password, user.password)) {throw new AppError(`User or password is invalid.`, 400);}
    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    )
    return {token}
}