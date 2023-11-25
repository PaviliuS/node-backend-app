const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller.js')

const {check} = require("express-validator")
const authMiddleware = require('../middleware/auth.middleware.js')

router.post('/auth/registration',[
    check('username', "Имя пользователя обязательно").notEmpty(),
    check('password', "Пароль должен быть от 4 до 10 символов").isLength({min:4, max:10})
], authController.registration)
router.post('/auth/login', authController.login)
router.get('/auth/user', authMiddleware("user"), authController.getUserList)
router.post('/auth/encrypt', authController.encodeToken)
router.post('/auth/decrypt', authController.decryptToken)

module.exports = router