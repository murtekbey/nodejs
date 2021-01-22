const getDb = require('../utility/database').getdb;
const mongodb = require('mongodb');

class Product {
    constructor(name, price, imageUrl, description, id, userId, categories) {
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectID(id) : null; // id varsa mongodb üzerinden bir object id üretilsin yoksa null gelsin.
        this.userId = userId;
        this.categories = (categories && !Array.isArray(categories)) ? Array.of(categories) : categories;
    }

    save() {
        let db = getDb();

        if (this._id) {
            db = db.collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        }
        else {
            db = db.collection('products')
                .insertOne(this);
        }

        return db
            .then(result => {
                console.log(result);
            })
            .catch(err => { console.log(err) });
    }

    static findAll() {
        const db = getDb();
        return db.collection('products')
            .find({})
            .project({ description: 0 })
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            })
    };

    static findById(productid) {
        const db = getDb();
        // return db.collection('products')
        //     .find({_id : new mongodb.ObjectID(productid)})
        //     .toArray()
        //     .then(products => {
        //         return products;
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })

        return db.collection('products')
            .findOne({ _id: new mongodb.ObjectID(productid) })
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    };

    static deleteById(productid) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectID(productid) })
            .then(() => {
                console.log('Product is deleted.');
            })
            .catch(err => {
                console.log(err);
            });
    };

    static findByCategoryId(categoryid) {
        const db = getDb();
        return db.collection('products')
            .find({ categories: categoryid})
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    };
};

module.exports = Product;