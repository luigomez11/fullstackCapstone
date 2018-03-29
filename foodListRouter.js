const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {FoodList} = require('./models');

FoodList.create('banana', 105);
FoodList.create('oatmeal', 155);
FoodList.create('bagel', 255);

router.get('/', (req,res) => {
    res.json(FoodList.get());
});

router.post('/', jsonParser, (req,res) => {
    const requiredFields = ['name', 'calories'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = FoodList.create(req.body.name, req.body.calories);
    res.status(201).json(item);
});

router.delete('/:id', (req,res) => {
    FoodList.delete(req.params.id);
    console.log(`Deleted food item \`${req.params.ID}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req,res) => {
    const requiredFields = ['name', 'calories', 'id'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if(req.params.id !== req.body.id){
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating food item \`${req.params.id}\``);
    const updatedItem = FoodList.update({
        id: req.params.id,
        name: req.body.name,
        budget: req.body.calories
    });
    res.status(204).end();
});

module.exports = router;