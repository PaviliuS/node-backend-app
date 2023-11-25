const jwt = require('jsonwebtoken')
const {secretDev, secretProd, mode} = require('../config')
const crypto = require('crypto-js')

module.exports = function (roleValue) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            if (!req.headers.authorization) {
                return res.status(403).json({message: "Authorization error"})
            }

            const token = req.headers.authorization.replace('Bearer ','')

            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }

            if (mode==='dev') {
                // Decrypt crypto
                const bytes  = crypto.AES.decrypt(token, secretDev);
                const {role} = JSON.parse(bytes.toString(crypto.enc.Utf8));

                if (role !== roleValue) {
                    return res.status(403).json({message: "У вас нет доступа"})
                }
            } else {
                // Decrypt JWT
                const {role} = jwt.verify(token, secretProd)    

                if (role !== roleValue) {
                    return res.status(403).json({message: "У вас нет доступа"})
                }
            }
 
            next();
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
};