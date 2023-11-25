const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller.js')

// define the home page route
router.post('/user', userController.createUser)
router.get('/user', userController.getUserList)
router.get('/user/:id', userController.getUser)
router.put('/user/:id', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router