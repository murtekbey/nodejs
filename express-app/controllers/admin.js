const Product = require('../models/product');
const Category = require('../models/category');

// GET ALL PRODUCTS --> admin/products
exports.getProducts = (req, res, next) => {
    Product.find()
        // .find({ name: 'Iphone 6', price: 2000 }) // ismi Iphone6 ve fiyatı 2000 olan tüm ürünleri getirir.
        // .limit(10) // 10 tanesini getirir.
        // .sort({ name: 1 }) // isme göre sıralar.
        // .sort({ name: -1 }) // isme göre tersten sıralar.
        // .select({name: 1, price: 1}) // sadece name ve fiyat kolonları gelir.
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
    res.render('admin/add-product', {
        title: 'New Product',
        path: '/admin/add-product',
    });
};

// POST ADD PRODUCT -->
exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(
        {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description
        }
    );
    product.save()
        .then(result => {
            res.redirect('/admin/products?action=create');
        })
        .catch(err => {
            console.log(err);
        });
};

// GET EDIT PRODUCT -->
exports.getEditProduct = (req, res, next) => {

    Product.findById(req.params.productid)
        .then(product => {
            res.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/products',
                product: product,
            });
        })
        .catch(err => {
            console.log(err);
        });

};

// POST EDIT PRODUCT --> /admin/products?action=edit
exports.postEditProduct = (req, res, next) => {

    // query first
    // update first

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    Product.update({ _id: id }, {
        $set: {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description
        }
    })
        .then(() => {
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => {
            console.log(err);
        })

    // Product.findById(id)
    //     .then(product => {
    //         product.name = name;
    //         product.price = price;
    //         product.imageUrl = imageUrl;
    //         product.description = description;
    //         return product.save()
    //     })
    //     .then(() => {
    //         res.redirect('/admin/products?action=edit');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
};

// POST DELETE PRODUCT --> admin/products?action=delete
exports.postDeleteProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.body.productid)
        .then(() => {
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            console.log(err)
        });
};


// GET ALL CATEGORIES --> admin/categories
exports.getCategories = (req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/categories', {
                title: 'Admin Categories',
                categories: categories,
                path: '/admin/categories',
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// GET ADD CATEGORY --> admin/add-category
exports.getAddCategory = (req, res, next) => {
    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category',
    });
};

// POST ADD CATEGORY -->
exports.postAddCategory = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const category = new Category(name, description, null, req.user._id);

    category.save()
        .then(result => {
            res.redirect('/admin/categories?action=create');
        })
        .catch(err => {
            console.log(err);
        });
};

// GET EDIT CATEGORY -->
exports.getEditCategory = (req, res, next) => {

    Category.findById(req.params.categoryid)
        .then(category => {
            console.log(category);
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: '/admin/categories',
                category: category,
            });
        })
        .catch(err => {
            console.log(err);
        });

};

// POST EDIT CATEGORY --> /admin/categories?action=edit
exports.postEditCategory = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const category = new Category(name, description, id, req.user._id);

    category.save()
        .then(result => {
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => {
            console.log(err);
        })
};

// POST DELETE CATEGORY --> admin/categories?action=delete
exports.postDeleteCategory = (req, res, next) => {
    Category.deleteById(req.body.categoryid)
        .then(() => {
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => {
            console.log(err)
        });
};