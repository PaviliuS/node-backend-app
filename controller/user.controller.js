const db = require('../db')


class userController {
    async createUser(req, res) {
        const {name, surname} = req.body
        const newPerson = await db.query('INSERT INTO person (name, surname) VALUES ($1, $2) RETURNING *', [name ,surname])
        res.json(newPerson.rows[0])
    }
    async getUserList(req, res) {
        const userList = await db.query('SELECT * from person')
        res.json(userList.rows)
    }
    async getUser(req, res) {
        const id = req.params.id;
        const user = await db.query('SELECT * from person WHERE id = $1', [id])
        res.json(user.rows[0])
    }
    async updateUser(req, res) {
        const id = req.params.id;
        const {name, surname} = req.body
        const user = await db.query('UPDATE person SET name = $1, surname = $2 WHERE id = $3 RETURNING *', [name, surname, id])
        res.json(user.rows[0])
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        const user = await db.query('DELETE * from person WHERE id = $1', [id])
        res.json(user.rows[0])
    }
}

module.exports = new userController()