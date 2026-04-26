const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');
require('dotenv').config();

exports.register = async ({ username, password }) => {

    if (!username || !password) {
        throw new AppError(
            'Dados inválidos',
            400,
            [
                { field: 'username', error: 'Obrigatório' },
                { field: 'password', error: 'Obrigatório' }
            ],
            'VALIDATION_ERROR'
        );
    }

    if (username.length < 4) {
        throw new AppError(
            'Username inválido',
            400,
            { field: 'username', error: 'Mínimo 4 caracteres' },
            'INVALID_USERNAME'
        );
    }

    if (password.length < 8) {
        throw new AppError(
            'Password inválido',
            400,
            { field: 'password', error: 'Mínimo 8 caracteres' },
            'INVALID_PASSWORD'
        );
    }

    const user = await userRepo.findByUsername(username);

    if (user) {
        throw new AppError(
            'Usuário já cadastrado',
            400,
            { field: 'username', error: 'Já está em uso' },
            'USER_ALREADY_EXISTS'
        );
    }

    await userRepo.createUser(username, password);

    return {
        msg: 'successfully registered'
    };
};

exports.login = async ({ username, password }) => {

    const errors = [];

    if (!username) errors.push({ field: 'username', error: 'Obrigatório' });
    if (!password) errors.push({ field: 'password', error: 'Obrigatório' });

    if (errors.length) {
        throw new AppError(
            'Dados inválidos',
            400,
            errors,
            'VALIDATION_ERROR'
        );
    }

    const user = await userRepo.findByUsername(username);

    // 🔐 mensagem genérica (segurança)
    if (!user) {
        throw new AppError(
            'Usuário ou senha inválidos',
            401,
            null,
            'INVALID_CREDENTIALS'
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError(
            'Usuário ou senha inválidos',
            401,
            null,
            'INVALID_CREDENTIALS'
        );
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token };
};