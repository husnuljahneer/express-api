const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter')

router.use('/auth', authRouter);

module.exports = router;