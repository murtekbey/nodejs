const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

// /admin/add-product=> GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product=> POST
router.post('/add-product', adminController.postAddProduct);


// /admin/products/20 => GET
router.get('/products/:productid', adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/products', adminController.postEditProduct);

router.get('/products', adminController.getProducts);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;