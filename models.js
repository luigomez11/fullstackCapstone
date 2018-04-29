'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

//schema to represent food item with calories
const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true},
    user: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

foodSchema.methods.serialize = function(){
    return {
        id: this._id,
        name: this.name,
        calories: this.calories,
        user: this.user,
        date: this.date
    };
};

const foodItem = mongoose.model('foodItem', foodSchema); //registers model

module.exports = {foodItem}; //exports