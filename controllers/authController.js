const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const result = await authService.register({username, password});

        return res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const result = await authService.login({username, password});

        return res.json(result);
    } catch (err) {
        next(err);
    }
};