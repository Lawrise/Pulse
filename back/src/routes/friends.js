const express = require('express');
const { sendFriendRequest, getFriends } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/send-request', sendFriendRequest);
router.get('/friends', getFriends);

module.exports = router;
