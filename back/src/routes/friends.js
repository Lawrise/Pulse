const express = require('express');
const { sendFriendRequest, getFriends, getFriendRequests, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/send-request', sendFriendRequest);
router.get('/requests', getFriendRequests);
router.get('/friends', getFriends);
router.post('/request/accept', acceptFriendRequest);
router.post('/request/reject', rejectFriendRequest);

module.exports = router;
