'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

//schema to represent food item with calories
const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true},
    date: {type: Date, default: Date.now}
    //user: type string, required: true
    //date: (time)
});

foodSchema.methods.serialize = function(){
    return {
        id: this._id,
        name: this.name,
        calories: this.calories,
        date: this.date
    };
};

const foodItem = mongoose.model('foodItem', foodSchema);

module.exports = {foodItem};