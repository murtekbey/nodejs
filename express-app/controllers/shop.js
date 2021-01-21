const Product = require('../models/product');
const Category = require('../models/category');
const { response } = require('express');

// GET INDEX --> Homepage
exports.getIndex = (req, res, next) => {
    Product.findAll({ attributes: ['id', 'name', 'price', 'imageUrl'], })
        .then(products => {
            Category.findAll({ attributes: ['id', 'name'] })
                .then(categories => {
                    res.render("shop/index", {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET PRODUCTS --> products/
exports.getProducts = (req, res, next) => {
    Product.findAll({ attributes: ['id', 'name', 'price', 'imageUrl'] })
        .then(products => {
            Category.findAll({ attributes: ['id', 'name'], })
                .then(categories => {
                    res.render("shop/products", {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        path: '/products'
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
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
            const category = categories.find(i => i.id == categoryId);
            return category.getProducts();
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
    Product.findAll({
        attributes: ['id', 'name', 'price', 'imageUrl', 'description'],
        where: { id: req.params.productid }
    })
        .then(products => {
            res.render('shop/product-detail', {
                title: products[0].name,
                product: products[0],
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
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render("shop/cart", {
                        title: 'Cart',
                        path: '/cart',
                        products: products
                    });
                })
                .catch(err => { console.log(err); })
        })
        .catch(err => {
            console.log(err);
        });
};

// POST CART --> /cart/
exports.postCart = (req, res, next) => {

    const productId = req.body.productId; // ürünün product idsini aldık.
    let quantity = 1; // miktarını ilk gönderme de 1 olarak tanımladık.
    let userCart; // bir kullanıcı sepeti oluşturduk.

    req.user
        .getCart() // kullanıcı üzerinden sepeti getirdik.

        .then(cart => { // then sayesinde işlemleri sıra sıra yapıyoruz.
            userCart = cart; // aldığımız sepeti kullanıcı sepeti ile ilişkilendirdik.
            return cart.getProducts({ where: { id: productId } }); // sepete ürün idsine göre ürünleri getirdik.
        })

        .then(products => { // return ile getirdiğimiz ürünler.
            let product; // bir ürün değişkeni oluşturduk

            if (products.length > 0) { // eğer ürünlerin sayısı 0 dan büyükse
                product = products[0]; // ürünlerin ilk elemanı yukarda oluşturduğumuz ürün değişkenine eşitledik.
            }
            if (product) { // eşitlediğimiz ürün varsa eğer
                quantity += product.cartItem.quantity; // ürünün sepetteki adet sayısına 1 adet daha ekledik.
                return product; // daha sonra aynı ürünü tekrar gönderdik.
            }
            return Product.findByPk(productId); // daha sonra bu ürünü bir diğer aşamaya gönderdik.
        })

        .then(product => { // gönderdiğimiz ürün
            userCart.addProduct(product, { // kullanıcı sepetine ekledik
                through: { quantity: quantity } // ürün miktarını güncellenen miktar ile değiştirdik.
            })
        })

        .then(() => {
            res.redirect('/cart');
        })

        .catch(err => {
            console.log(err);
        });
};

// POST DELETE CART ITEM --> /cart/
exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productid } });
        })
        .then(products => {
            const product = products[0];

            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        });
};

// GET ORDERS --> /orders/
exports.getOrders = (req, res, next) => {

    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            console.log(orders);
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
    let userCart;
    req.user
        .getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity,
                            price: product.price
                        }
                        return product;
                    }));
                })
                .catch(err => { console.log(err); })
        })
        .then(() => {
            userCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => { console.log(err); });
};