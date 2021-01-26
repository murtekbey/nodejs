const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
