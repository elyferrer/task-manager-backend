const express = require('express');
const router = express.Router();

const accessTokenUtil = require('../utils/accessToken');

const taskController = require('../controllers/task');

router.get('/', accessTokenUtil.authenticateToken, taskController.get);
router.post('/', accessTokenUtil.authenticateToken, taskController.create);
router.patch('/:id', accessTokenUtil.authenticateToken, taskController.update);
router.delete('/:id', accessTokenUtil.authenticateToken, taskController.delete);

module.exports = router;