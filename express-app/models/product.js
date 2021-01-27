const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Ürün adı girmeniz gerekiyor.'], 
        minlength: [5, 'Ürün ismi için minimum 5 karakter girmelisiniz.'], 
        maxlength: [255, 'Ürün ismi için maximum 255 karakter girmelisiniz.'],
        lowercase: true,
        //uppercase: true,
        trim: true // boşluk karakterlerini alır.
    },
    price: {
        type: Number,
        required: function () {
            return this.isActive;
        }, 
        min: 0,
        max: 10000,
        get: value => Math.round(value), //10.2 => 10 - 10.8 => 11
        set: value => Math.round(value) //10.2 => 10 - 10.8 => 11
    },
    description: { 
        type: String, 
        minlength: 10 
    },
    imageUrl: String,
    date: { 
        type: Date, 
        default: Date.now 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;
            },
            message: 'Ürün için en az bir etiket giriniz.'
        }
    },
    isActive: Boolean,
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false
        }
    ]
});

module.exports = mongoose.model('Product', productSchema) // --> products (database name)
