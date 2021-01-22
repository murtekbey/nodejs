const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/products', adminController.getProducts);
router.get('/categories', adminController.getCategories);

// /admin/add-product=> GET
router.get('/add-product', adminController.getAddProduct);
router.get('/add-category', adminController.getAddCategory);

// /admin/add-product=> POST
router.post('/add-product', adminController.postAddProduct);
router.post('/add-category', adminController.postAddCategory);

// // /admin/products/20 => GET
router.get('/products/:productid', adminController.getEditProduct);
router.get('/categories/:categoryid', adminController.getEditCategory);

// // /admin/edit-product => POST
router.post('/products', adminController.postEditProduct);
router.post('/categories', adminController.postEditCategory);

router.post('/delete-product', adminController.postDeleteProduct);
router.post('/delete-category', adminController.postDeleteCategory);

module.exports = router;