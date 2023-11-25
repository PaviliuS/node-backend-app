const db = require('../db')

class postController {
    async createPost(req, res) {
        const {title, content, user_id} = req.body
        const newPost = await db.query('INSERT INTO post (title, content, user_id) VALUES ($1, $2, $3) RETURNING *', [title, content, user_id])
        res.json(newPost.rows[0])
    }
    async getPostList(req, res) {
        const id = req.params.id;
        const postList = await db.query('SELECT * from post WHERE user_id = $1', [id])
        res.json(postList.rows[0])
    }
}

module.exports = new postController()