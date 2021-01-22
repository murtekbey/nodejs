const getDb = require('../utility/database').getdb;
const mongodb = require('mongodb');

class Category {
    constructor(name, description, id, userId) {
        this.name = name;
        this.description = description;
        this._id = id ? new mongodb.ObjectID(id) : null; // id varsa mongodb üzerinden bir object id üretilsin yoksa null gelsin.
        this.userId = userId;
    }

    save() {
        let db = getDb();

        if (this._id) {
            db = db.collection('categories')
                .updateOne({ _id: this._id }, { $set: this });
        }
        else {
            db = db.collection('categories')
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
        return db.collection('categories')
            .find({})
            .project({})
            .toArray()
            .then(categories => {
                return categories;
            })
            .catch(err => {
                console.log(err);
            })
    };

    static findById(categoryid) {
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

        return db.collection('categories')
            .findOne({ _id: new mongodb.ObjectID(categoryid) })
            .then(category => {
                return category;
            })
            .catch(err => {
                console.log(err);
            });
    };

    static deleteById(categoryid) {
        const db = getDb();
        return db.collection('categories')
            .deleteOne({ _id: new mongodb.ObjectID(categoryid) })
            .then(() => {
                console.log('Category is deleted.');
            })
            .catch(err => {
                console.log(err);
            });
    }
};

module.exports = Category;