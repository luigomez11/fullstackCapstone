'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {foodItem} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedFoodData(){
    console.info('seeding food data');
    const seedData = [];

    for(let i=1; i<=10; i++){
        seedData.push(generateFoodData());
    }
    return foodItem.insertMany(seedData);
}

function generateFoodData(){
    return {
        name: faker.company.companyName(),
        calories: faker.random.number(),
        user: faker.company.companyName()
    };
}

function tearDownDb(){
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Calories API resource', function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedFoodData();
    });

    afterEach(function(){
        return tearDownDb();
    });

    after(function(){
        return closeServer();
    });

    describe('Get endpoint', function(){
        it('should return all exisiting food items', function(){
            let res;
            return chai.request(app)
                .get('/foodList/forUser/:userid')
                .then(function(_res){
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body.foods).to.have.lengthOf.at.least(1);
                    return foodItem.count(1);
                })
                .then(function(count){
                    expect(res.body.foods).to.have.lengthOf(count);
                });
        });

        it('should return food items with right fields', function(){
            let resFood;
            return chai.request(app)
                .get('/foodList/forUser/:userid')
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.foods).to.be.a('array');
                    expect(res.body.foods).to.have.lengthOf.at.least(1);

                    res.body.foods.forEach(function(food){
                        expect(food).to.be.a('object');
                        expect(food).to.include.keys('id','name','calories');
                    });
                    resFood = res.body.foods[0];
                    return foodItem.findById(resFood.id);
                })
                .then(function(food){
                    expect(resFood.id).to.equal(food.id);
                    expect(resFood.name).to.equal(food.name);
                    expect(resFood.calories).to.equal(food.calories);
                });
        });
    });

    describe('POST endpoint', function(){
        it('should add a new food item', function(){
            const newFood = generateFoodData();

            return chai.request(app)
                .post('/foodList')
                .send(newFood)
                .then(function(res){
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('id','name','calories');
                    expect(res.body.name).to.equal(newFood.name);
                    expect(res.body.calories).to.equal(newFood.calories);
                })
        });
    });

    describe('PUT endpoint', function(){
        it('should update fields you send over', function(){
            const updateData = {
                name: 'Mcdonalds',
                calories: 2000
            };

            return foodItem
                .findOne()
                .then(function(food){
                    updateData.id = food.id;

                    return chai.request(app)
                        .put(`/foodList/${food.id}`)
                        .send(updateData);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                    return foodItem.findById(updateData.id);
                })
                .then(function(food){
                    expect(food.name).to.equal(updateData.name);
                    expect(food.calories).to.equal(updateData.calories);
                });
        });
    });

    describe('DELETE endpoint', function(){
        it('should delete a food by id', function(){
            let food;

            return foodItem
                .findOne()
                .then(function(_food){
                    food = _food;
                    return chai.request(app).delete(`/foodList/${food.id}`);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                    return foodItem.findById(food.id);
                })
                .then(function(_food){
                    expect(_food).to.be.null;
                });
        });
    });
});