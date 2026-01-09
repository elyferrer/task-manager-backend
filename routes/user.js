const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

const accessTokenUtil = require('../utils/accessToken');

router.post('/login', userController.login);
router.post('/token', userController.generateNewToken);
router.post('/', userController.create);
router.get('/', accessTokenUtil.authenticateToken, userController.get);
router.put('/', accessTokenUtil.authenticateToken, userController.update);
router.put('/deactivate', accessTokenUtil.authenticateToken, userController.deactivate);
router.delete('/logout', accessTokenUtil.authenticateToken, userController.logout);

module.exports = router;