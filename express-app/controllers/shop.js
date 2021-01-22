const Product = require('../models/product');
const Category = require('../models/category');

// GET INDEX --> Homepage
exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render("shop/index", {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET PRODUCTS --> products/
exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render("shop/products", {
                        title: 'Products',
                        products: products,
                        path: '/products',
                        categories: categories
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET PRODUCTS BY CATEGORY ID --> /products/
exports.getProductsByCategoryId = (req, res, next) => {
    const categoryId = req.params.categoryid;
    const model = [];

    Category.findAll()
        .then(categories => {
            model.categories = categories;
            return Product.findByCategoryId(categoryId);
        })
        .then(products => {
            res.render("shop/products", {
                title: 'Products',
                products: products,
                categories: model.categories,
                selectedCategory: categoryId,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err)
        })
};

// GET PRODUCT BY ID --> /products/id
exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productid)
        .then(products => {
            res.render('shop/product-detail', {
                title: products.name,
                product: products,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET CART --> /cart/
exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render("shop/cart", {
                title: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// POST CART --> /cart/
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err)
        });
};

// POST DELETE CART ITEM --> /cart/
exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user
        .deleteCartItem(productid)
        .then(() => {
            res.redirect('/cart');
        });
};

// GET ORDERS --> /orders/
exports.getOrders = (req, res, next) => {

    req.user
        .getOrders()
        .then(orders => {
            res.render("shop/orders", {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => { console.log(err); })
};

// POST ORDERS --> /create-order/
exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};