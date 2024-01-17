const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const { all, add, consumer, remove, edit } = require('../controllers/consumers')

// * /api/consumers/
router.get('/', auth, all)
// * /api/consumers/:id
router.get('/:id', auth, consumer)
// * /api/consumers/add
router.post('/add', auth, add)
// * /api/consumers/remove/:id
router.post('/remove/:id', remove)
// * /api/consumers/edit/:id
router.put('/edit/:id', edit)

module.exports = router
