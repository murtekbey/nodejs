const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// dynamic olan yapıları her zaman en altta tutmalıyız. !!!!!!
router.get('/products/:productid', shopController.getProduct); // dynamic

router.get('/categories/:categoryid', shopController.getProductsByCategoryId);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/delete-cartitem', shopController.postCartItemDelete);

router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);



module.exports = router;