const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authorization = require('../middleware/authorization');

router.post('/checkout', authorization, orderController.createOrder);
router.get('/', authorization, orderController.getOrders);

module.exports = router;
