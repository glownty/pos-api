const authService = require('../services/authService');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await authService.register({username, password});
        return res.json(result)

    }catch (err){
        return res.status(err.status || 500).json({
            message: err.message
            })
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const result = await authService.login({username, password});
        return res.json(result)
    } catch (err) {
        return res.status(err.status || 500).json({
            message: err.message
        })
    }
}