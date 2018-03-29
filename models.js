'use strict';

const mongoose = require('mongoose');

//schema to represent food item with calories
const foodSchema = monogoose.Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true}
});

foodSchema.methods.serialize = function(){
    return {
        id: this._id,
        name: this.name,
        carlories: this.calories
    };
};

const foodItem = mongoose.model('foodItem', foodSchema);

module.exports = {foodItem};