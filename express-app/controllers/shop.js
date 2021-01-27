const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');

// GET INDEX --> Homepage
// $eq (equal)
// $ne (not equal)
// $gt (greater than)
// $gte (greater than or equal)
// $lt (less than)
// $lte (less than or equal)
// $in (in)
// $nin (not in)
// .find({ price : { $eq: 2000 }})
// .find({ price : { $ne: 2000 }})
// .find({ price : { $gt: 2000 }})
// .find({ price : { $gte: 2000 }})
// .find({ price : { $lt: 2000 }})
// .find({ price : { $lte: 2000 }})
// .find({ price : { $in: [1000,2000,3000] }})
// .find({ price : { $gte: 1000, $lte: 2000 }}) greater than 1000 and less than 2000
// .or([{ price: {$gt: 2000}, name: 'Samsung S6' }]) iki kriterden biri doğru olursa getirir.
// .find({name: /^Samsung/}) // starts with
// .find({name: /Samsung$/}) // ends with
// .find({name: /.*Samsung.*/}) // contains

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            return products;
        })
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render("shop/index", {
                        title: 'Shopping',
                        products: products,
                        path: '/',
                        categories: categories
                    });
                })
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

// GET PRODUCTS --> products/
exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            return products;
        })
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render("shop/products", {
                        title: 'Products',
                        products: products,
                        path: '/products',
                        categories: categories
                    });
                })
        })
        .catch((err) => {
            next(err);
        });
};

// GET PRODUCTS BY CATEGORY ID --> /products/
exports.getProductsByCategoryId = (req, res, next) => {
    const categoryId = req.params.categoryid;
    const model = [];

    Category.find()
        .then(categories => {
            model.categories = categories;
            return Product.find({
                categories: categoryId
            });
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
            next(err);
        })
};

// GET PRODUCT BY ID --> /products/id
exports.getProduct = (req, res, next) => {
    Product
        .findById(req.params.productid)
        .then(products => {
            res.render('shop/product-detail', {
                title: products.name,
                product: products,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

// GET CART --> /cart/
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render("shop/cart", {
                title: 'Cart',
                path: '/cart',
                products: user.cart.items
            });
        })
        .catch(err => {
            console.log(err);
            next(err);
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
            console.log(err);
            next(err);
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

    Order
        .find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render("shop/orders", {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => { next(err); })
};

// POST ORDERS --> /create-order/
exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                },
                items: user.cart.items.map(p => {
                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl
                        },
                        quantity: p.quantity
                    };
                })
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};