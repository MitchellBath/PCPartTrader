const express = require('express');
const controller = require('../controllers/tradeController');
const {isLoggedIn, isAuthor} = require('../middleware/auth')
const {validateId, validateTrade} = require('../middleware/validator')

const router = express.Router();

// GET /trades: send all trades to the user
router.get('/', controller.index);

// GET /trades/new: send html form for creating a new trade
router.get('/new', isLoggedIn, controller.new);

// POST /trades: create a new trade
router.post('/', isLoggedIn, validateTrade, controller.create);

// GET /trades/:id: send details of trade identified by id
router.get('/:id', validateId, controller.show);

// GET /trades/:id/edit: send html form for editing existing trade
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

// GET /trades/:id/offer: send html form for offering for a trade
router.get('/:id/offer', validateId, isLoggedIn, controller.offer);

// PUT /trades/:id: update the trade identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateTrade, controller.update);

// DELETE /trades/:id, delete the trade identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;