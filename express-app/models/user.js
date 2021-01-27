const Product = require('./product');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [isEmail, 'Geçersiz Email Adresi']
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cp => { // kullanıcının sepetinde product var mı yok mu bu değeir döndürücek.
        return cp.productId.toString() === product._id.toString()
    });

    const updatedCartItems = [...this.cart.items]; // kullanıcının bütün ürün bilgilerini dizi şeklinde updatedCartItem'a atıyoruz.

    let itemQuantity = 1;
    if (index >= 0) {
        // cart zaten eklenmek istenen product var: quantity'i arttır.
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity
    } else {
        // updatedCartItems'a yeni bir eleman ekle.
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity
        });
    };

    this.cart = {
        items: updatedCartItems
    }

    return this.save();
}

userSchema.methods.getCart = function () {
    const ids = this.cart.items.map(i => { // kullanıcının sepeti içerisindeki elemanları map metodu aracıyla sadece idlerini bir dizi içerisine alarak geriye göndermek.
        return i.productId;
    });

    return Product
        .find({
            _id: {
                $in: ids
            }
        })
        .select('name price imageUrl')
        .then(products => {
            return products.map(p => {
                return {
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    quantity: this.cart.items.find(i => {
                        // kullanıcının sepetteki elemanları içerisindeki elemanlara bakarak 
                        // o anki p objesinin idsine eşit olan elemanın quantity bilgisine ulaşıyoruz.
                        return i.productId.toString() === p._id.toString()
                    }).quantity
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
};

userSchema.methods.deleteCartItem = function (productid) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productid.toString()
    });

    this.cart.items = cartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);