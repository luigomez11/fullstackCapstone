'use strict';

const mongoose = require('mongoose');

//schema to represent food item with calories
const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true}
    //user: type string, required: true
    //date: (time)
});

foodSchema.methods.serialize = function(){
    return {
        id: this._id,
        name: this.name,
        calories: this.calories
    };
};

const foodItem = mongoose.model('foodItem', foodSchema);

module.exports = {foodItem};