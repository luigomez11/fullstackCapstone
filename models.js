const uuid = require('uuid');

function StorageException(message){
    this.message = message;
    this.name = "StorageException";
};

const FoodList = {
    create: function(name, calories){
        console.log('Creating new food item');
        const item = {
            name: name,
            calories: calories,
            id: uuid.v4()
        };
        this.items[item.id] = item;
        return item;
    },
    get: function(){
        console.log('Retrieving food items');
        return Object.keys(this.items).map(key => this.items[key]);
    },
    delete: function(id){
        console.log(`Deleting shopping list item \`${id}\``);
        delete this.items[id];
    },
    update: function(updatedItem){
        if(!(id in this.items)){
            throw StorageException(
                `Can't update item \`${id}\` because doesn't exist.`)
        }
        this.items[updatedItem.id] = updatedItem;
        return updatedItem;
    }
};

function createFoodList(){
    const storage = Object.create(FoodList);
    storage.items = {};
    return storage;
};

module.exports = {
    FoodList: createFoodList()
};