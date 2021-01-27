const Product = require('../models/product');
const Category = require('../models/category');
const fs = require('fs');

// GET ALL PRODUCTS --> admin/products
// .find({ name: 'Iphone 6', price: 2000 }) // ismi Iphone6 ve fiyatı 2000 olan tüm ürünleri getirir.
// .limit(10) // 10 tanesini getirir.
// .sort({ name: 1 }) // isme göre sıralar.
// .sort({ name: -1 }) // isme göre tersten sıralar.
// .select({name: 1, price: 1}) // sadece name ve fiyat kolonları gelir.


exports.getProducts = (req, res, next) => {
    Product
        .find({ userId: req.user })
        .populate('userId', 'name -_id')
        .select('name price imageUrl userId')
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
            next(err);
        });
};

// GET ADD PRODUCT --> admin/add-product
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        title: 'New Product',
        path: '/admin/add-product',
        inputs: {
            name: '',
            price: '',
            description: ''
        }
    });
};

// POST ADD PRODUCT -->
exports.postAddProduct = (req, res, next) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    const description = req.body.description;
    const ids = req.body.categoryids;

    if (!image) {
        return res.render('admin/add-product', {
            title: 'New Product',
            path: '/admin/add-product',
            errorMessage: "Lütfen bir resim seçiniz.",
            categories: categories,
            inputs: {
                name: name,
                price: price,
                description: description
            }
        });
    }

    const product = new Product(
        {
            name: name,
            price: price,
            imageUrl: image.filename,
            description: description,
            userId: req.user,
            isActive: false,
            tags: ['akıllı telefon'],
            categories: ids
        }
    );

    product.save()
        .then(() => {
            res.redirect('/admin/products?action=create');
        })
        .catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }

                res.render('admin/add-product', {
                    title: 'New Product',
                    path: '/admin/add-product',
                    errorMessage: message,
                    inputs: {
                        name: name,
                        price: price,
                        description: description
                    }
                });
            }
            else {
                console.log(err);
                next(err);
            }
        });
};

// GET EDIT PRODUCT -->
exports.getEditProduct = (req, res, next) => {

    Product.findOne({ _id: req.params.productid, userId: req.user._id })
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            return product;
        })
        .then(product => {

            Category.find()
                .then(categories => {

                    categories = categories.map(category => {
                        if (product.categories) {
                            product.categories.find(item => {
                                if (item.toString() === category._id.toString()) {
                                    category.selected = true;
                                }
                            })
                        }
                        return category;
                    })

                    res.render('admin/edit-product', {
                        title: 'Edit Product',
                        path: '/admin/products',
                        product: product,
                        categories: categories
                    });
                })
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

// POST EDIT PRODUCT --> /admin/products?action=edit
exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const image = req.file;
    const description = req.body.description;
    const ids = req.body.categoryids;

    Product.findOne({ _id: id, userId: req.user._id })
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            product.name = name;
            product.price = price;
            product.description = description;
            product.categories = ids;

            if (image) {
                fs.unlink('public/img/' + product.imageUrl, err => {
                    if (err) {
                        console.log(err);
                    }
                });
                product.imageUrl = image.filename;
            }
            return product.save();
        }).then(result => {
            res.redirect('/admin/products?action=edit');
        }).catch(err => { console.log(err); })
};

// POST DELETE PRODUCT --> admin/products?action=delete
exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid

    Product.findOne({ _id: id, userId: req.user._id })
        .then(product => {
            if (!product) {
                return next(new Error('Silinmek istenen ürün bulunamadı.'));
            }
            fs.unlink('public/img/' + product.imageUrl, err => {
                if (err) {
                    console.log(err);
                }
            });

            return Product.deleteOne({ _id: id, userId: req.user._id })
                .then((result) => {
                    if (result.deletedCount === 0) {
                        return next(new Error('Silinmek istenen ürün bulunamadı.'));
                    }
                    res.redirect('/admin/products?action=delete');
                })
                .catch(err => {
                    console.log(err);
                    next(err);
                });
        })
};

// GET ADD CATEGORY --> admin/add-category
exports.getAddCategory = (req, res, next) => {
    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category'
    });
};

// POST ADD CATEGORY -->
exports.postAddCategory = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;

    const category = new Category({
        name: name,
        description: description,
    });

    category.save()
        .then(() => {
            res.redirect('/admin/categories?action=create');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

// GET ALL CATEGORIES --> admin/categories
exports.getCategories = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render('admin/categories', {
                title: 'Admin Categories',
                path: '/admin/categories',
                categories: categories,
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

// GET EDIT CATEGORY -->
exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryid)
        .then(category => {
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: '/admin/category',
                category: category
            });
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

// POST EDIT CATEGORY --> /admin/categories?action=edit
exports.postEditCategory = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.findById(id)
        .then(category => {
            category.name = name;
            category.description = description;
            return category.save();
        })
        .then(() => {
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => {
            console.log(err);
            next(err);
        })
};

// POST DELETE CATEGORY --> admin/categories?action=delete
exports.postDeleteCategory = (req, res, next) => {

    const id = req.body.categoryid;

    Category.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};