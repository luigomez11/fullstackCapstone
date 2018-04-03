/*function getUserInput(display){
    $.getJSON('/foodlist', displayUserInput)
};

function displayUserInput(data){
    console.log(data);
    data.foods.forEach(function(item){
        for(key in item){
            $('.log').append(
                '<p>' + item[key] + '</p>'
            );
        }
    });
};

function getAndDisplayUserInput(){
    getUserInput(displayUserInput);
};

$(function(){
    getAndDisplayUserInput();
})*/

function begin(){
    $('.welcomeButton').click(function(event){
        $('.welcome').addClass('hidden');
        $('.calorieCalculator').removeClass('hidden');
    });
};

begin();

function calorieCalculator(){
    $('#calculator').on('click', ':submit', function(event){
        event.preventDefault();
        let bmr;
        let gender = $('#gender').val();
        let age = $('#age').val()*1;
        let feet = $('#feet').val()*12;
        let inches = $('#inches').val()*1;
        let weight = $('#weight').val()*0.453592;
        let activity = $('#activity').val()*1;
        let goal = $('#goal').val();
        if(gender==="male"){
            bmr = Math.round(((10*weight)+(6.25*(feet+inches)*2.54)-(5*age)+5)*activity);
        }else{
            bmr = Math.round(((10*weight)+(6.25*(feet+inches)*2.54)-(5*age)-161)*activity);
        };
        if(goal==="lose"){
            bmr = bmr - 500;
        }else if(goal==="gain"){
            bmr = bmr + 500;
        }
        $('#recCal').html(`
            You're recommended calories for the day are: ${bmr}
        `)
    })
}

calorieCalculator();

//requests
let foodItemTemp = (`
    <li class="foodItem">
        <p class="foodName"></p>
        <p class="foodCalories"></p>
        <button id="edit">Edit</button>
        <button id="delete">Delete</button>
    </li>
`)

let foodList_URL = '/foodList';

function getAndDisplayFoodList(){
    $.getJSON(foodList_URL, function(foods){
        let foodElements = foods.map(function(food){
            let element = $(foodItemTemp);
            element.attr('id', item.id);
            let foodName = element.find('.foodName');
            foodName.text(food.name);
            let foodCalories = element.find('.foodCalories');
            foodCalories.text(food.calories);
            return element
        });
        $('.log').html(foodElements);
    });
}

function addFoodItem(item){
    $.ajax({
        method: 'POST',
        url: foodList_URL,
        data: JSON.stringify(item),
        success: function(data){
            getAndDisplayFoodList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteFoodItem(itemId){
    $.ajax({
        url: foodList_URL + '/' + itemId,
        method: 'DELETE',
        success: getAndDisplayFoodList
    });
}

function updateFoodItem(item){
    $.ajax({
        url: foodList_URL + '/' + item.id,
        method: 'PUT',
        data: JSON.stringify(item),
        success: function(data){
            getAndDisplayFoodList()
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function handleFoodItemAdd(){
    $('#foodForm').submit(function(event){
        event.preventDefault();
        addFoodItem({
            name: $(event.currentTarget).find('#newFoodName').val(),
            calories: $(event.currentTarget).find('#newFoodCalories').val()
        });
    });
}

function handleDelete(){
    $('.log').on('click', '#delete', function(event){
        event.preventDefault();
        deleteFoodItem(
            $(event.currentTarget).closest('.foodItem').attr('id')
        );
    });
}

$(function(){
    getAndDisplayFoodList();
    handleDelete();
    handleFoodItemAdd();
});