    const db = require('../config/db')
    const bcrypt = require('bcrypt')

    exports.findByUsername = async (username) => {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return users[0];
    };

    exports.createUser = async (username, password) => {

        console.log("PASSWORD DEBUG:", password, typeof password);
        const hashedPassword = await bcrypt.hash(password, 10);


        await db.execute(
            'INSERT INTO users (username, password) VALUES (?,?)',
            [username, hashedPassword]
        );
    }