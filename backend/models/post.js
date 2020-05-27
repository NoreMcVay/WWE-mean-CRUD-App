const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    finisher: { type: String, required: true },
    imagePath: { type: String, required: true },
    modalImagePath: { type: String, required: true }
});

module.exports = mongoose.model('Wrestlers', postSchema);