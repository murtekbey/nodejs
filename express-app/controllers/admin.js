const Product = require('../models/product');
const Category = require('../models/category');

// GET ALL PRODUCTS --> admin/products
exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Products',
                products: products,
                path: '/admin/products',
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET ADD PRODUCT --> admin/add-product
exports.getAddProduct = (req, res, next) => {
    Category.findAll()
    .then((categories) => {
        res.render('admin/add-product', {
            title: 'New Product',
            path: '/admin/add-product',
            categories: categories,
        });
    })
};

// POST ADD PRODUCT -->
exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryId = req.body.categoryid;
    const user = req.user;

    user.getProducts
    Product.findAll({})

    user.createProduct({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        categoryId : categoryId,
    })
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
};

// GET EDIT PRODUCT -->
exports.getEditProduct = (req, res, next) => {
    Product.findByPk(req.params.productid)
        .then((product) => {
            if(!product) {return res.redirect('/');}
            Category.findAll()
                .then((categories) => {
                    res.render('admin/edit-product', {
                        title: 'Edit Product',
                        path: '/admin/products',
                        product: product,
                        categories: categories,
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// POST EDIT PRODUCT --> /admin/products?action=edit
exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryId = req.body.categoryid;
    Product.findByPk(id)
        .then(product => {
            product.name = name;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            product.categoryId = categoryId;
            return product.save();
        })
        .then(result => {
            console.log('updated');
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => {
            console.log(err);
        })
};

// POST DELETE PRODUCT --> admin/products?action=delete
exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productid;
    Product.findByPk(id)
        .then(product => {
           return product.destroy();
        })
        .then(result => {
            console.log('product has been deleted.');
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            console.log(err)
        });
};