const express = require('express');
const router = express.Router();
const createUser = require('../controllers/userController').createUser;

router.get('/', (req, res) => {
    createUser();
});

module.exports = router;