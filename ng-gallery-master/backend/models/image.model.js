const mongoose = require('mongoose');
const _ = require('lodash');

const ImageSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String, 
        required: true,
        trim: true
    },
    img: {
        type: String, 
        required: true
    }
});


ImageSchema.methods.toJSON = function() {
    const imageobj = this.toObject();
    return _.omit(imageobj, ['_id', '__v']);
}

const Image = mongoose.model('Image', ImageSchema);

module.exports = { Image }