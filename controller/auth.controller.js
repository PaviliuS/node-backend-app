const db = require('../db')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secretDev, secretProd, mode} = require("../config")
const crypto = require('crypto-js')

const generateAccessToken = (id, role) => {
    if (mode === 'dev') {
        const payload = {
            id,
            role,
            secretDev,
        }
        // Encrypt crypto
        const encryptedData = crypto.AES.encrypt(JSON.stringify(payload), secretDev).toString();
        return encryptedData
    } else {
        const payload = {
            id,
            role
        }
         // Encrypt JWT
        return jwt.sign(payload, secretProd, {expiresIn: "24h"} )
    }
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error', errors})
            }

            const {username, password} = req.body

            const user = await db.query('SELECT * from userList WHERE username = $1', [username])
            if (user.rows.length) {
                return res.status(400).json({message: 'User existed error'});
            }

            const hashPassword = bcrypt.hashSync(password, 5)

            const role = await db.query('SELECT * from roleList WHERE value = $1', ['user'])
            if (role.rows.length === 0) {
                return res.status(400).json({message: 'Role not existed error'});
            }

            const newUser = await db.query('INSERT INTO userList (username, password, role_id) VALUES ($1, $2, $3) RETURNING *', [username, hashPassword, role.rows[0].id])
            res.status(200).json({message: 'User added', user: newUser.rows[0]});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    } 
    async login(req, res) {
        try {
            const {username, password} = req.body

            const user = await db.query('SELECT * from userList WHERE username = $1', [username])
            if (!user.rows.length) {
                return res.status(400).json({message: 'User not existed error'});
            }

            const validPassword = bcrypt.compareSync(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({message: 'Not valid password error'});
            }

            const role = await db.query('SELECT * from roleList WHERE id = $1', [user.rows[0].role_id])
            if (role.rows.length === 0) {
                return res.status(400).json({message: 'Role not existed error'});
            }

            const token = generateAccessToken(user.rows[0].id, role.rows[0].value)
            return res.json({token})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
    async getUserList(_, res) {
        try {
            const userList = await db.query('SELECT * from userList')
            res.status(200).json(userList.rows)
        } catch (e) {
            console.log(e)
        }
    }
    async encodeToken(req, res) {
        const payload = req.body

        // Encrypt crypto
        const encryptedData = crypto.AES.encrypt(JSON.stringify(payload), payload.secret).toString();
            
        return res.json(encryptedData)
    }
    async decryptToken(req, res) {
        const {token, secret} = req.body

        const bytes  = crypto.AES.decrypt(token, secret);
        const payload = JSON.parse(bytes.toString(crypto.enc.Utf8));

        return res.json(payload)
    }
}

module.exports = new authController()