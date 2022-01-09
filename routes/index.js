const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter')

router.use(authRouter);

module.exports = router;