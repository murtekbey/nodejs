const Product = require('../models/product');
const Category = require('../models/category');

// GET ALL PRODUCTS --> admin/products
// .find({ name: 'Iphone 6', price: 2000 }) // ismi Iphone6 ve fiyatı 2000 olan tüm ürünleri getirir.
// .limit(10) // 10 tanesini getirir.
// .sort({ name: 1 }) // isme göre sıralar.
// .sort({ name: -1 }) // isme göre tersten sıralar.
// .select({name: 1, price: 1}) // sadece name ve fiyat kolonları gelir.
exports.getProducts = (req, res, next) => {
    Product.find()
        .populate('userId', 'name -_id')
        .select('name price userId imageUrl')
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
    Category.find()
        .then(categories => {
            return categories;
        })
        .then(categories => {
            res.render('admin/add-product', {
                title: 'New Product',
                path: '/admin/add-product',
                categories : categories
            });
        })
        .catch(err => {
            console.log(err);
        })
};

// POST ADD PRODUCT -->
exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const ids = req.body.categoryids;
    const product = new Product(
        {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            userId: req.user,
            categories: ids
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
        //.populate('categories', 'name -_id')
        .then(product => {
            return product;
        })
        .then(product => {

            Category.find()
                .then(categories => {
                    categories = categories.map(category => {

                        if(product.categories) {
                            product.categories.find(item => {
                                if(item.toString() === category._id.toString()) {
                                    category.selected=true;
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
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => console.log(err));
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
    const ids = req.body.categoryids;

    Product.update({ _id: id }, {
        $set: {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            categories: ids
        }
    })
        .then(() => {
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => {
            console.log(err);
        })
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
    Category.find()
        .then(categories => {
            console.log(categories);
            res.render('admin/categories', {
                title: 'Admin categories',
                path: '/admin/categories',
                categories: categories,
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
        path: '/admin/add-category'
    });
};

// POST ADD CATEGORY -->
exports.postAddCategory = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const category = new Category(
        {
            name: name,
            description: description,
            userId: req.user
        }
    );
    category.save()
        .then(() => {
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
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: '/admin/category',
                category: category
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

    Category.update({ _id: id }, {
        $set: {
            name: name,
            description: description
        }
    })
        .then(() => {
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => {
            console.log(err);
        })
};

// POST DELETE CATEGORY --> admin/categories?action=delete
exports.postDeleteCategory = (req, res, next) => {
    Category.findByIdAndRemove(req.body.categoryid)
        .then(() => {
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => {
            console.log(err)
        });
};