let token;
let userId;
let bmr;

function begin(){
    $('.login').click(function(event){
        $('#userLogin').removeClass('hidden');
        $('.welcome').addClass('hidden');
        $('.noUser').removeClass('hidden');
    });
    $('.signup').click(function(event){
        $('#userSignUp').removeClass('hidden');
        $('.welcome').addClass('hidden');
        $('.yesUser').removeClass('hidden');
    });
};

function yesOrNoUser(){
    $('.noUser').click(function(event){
        $('#userLogin').addClass('hidden');
        $('#userSignUp').removeClass('hidden');
        $('.noUser').addClass('hidden');
        $('.yesUser').removeClass('hidden');
    });
    $('.yesUser').click(function(event){
        $('#userSignUp').addClass('hidden');
        $('#userLogin').removeClass('hidden');
        $('.yesUser').addClass('hidden');
        $('.noUser').removeClass('hidden');
    });
}


function userLoginSubmit(){
    $('#userLogin').submit(function(event){
        event.preventDefault();
        userLoginPost({
            username: $(event.currentTarget).find('#username').val(),
            password: $(event.currentTarget).find('#password').val()
        })
    })
}

function userLogout(){
    $('#logout').click(function(event){
        token = 0;
        username = 0;
        bmr = 0;
        $('#welcome').removeClass('hidden');
        $('.noUser').removeClass('hidden');
        $('.calorieCalculator').addClass('hidden');
        $('.caloriesScreen').addClass('hidden');
        $('.input').addClass('hidden');
        $('#logout').addClass('hidden');
        $('#username').val('');
        $('#password').val('');
    })
}

function calorieCalculator(){
    $('#calculator').on('click', ':submit', function(event){  //use if statements for required
        event.preventDefault();
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
        $('.calorieCalculator').addClass('hidden');
        $('.caloriesScreen').removeClass('hidden');
        $('#recCal').html(`
            Your recommended calories for the day are: ${bmr}
        `)
    })
}

function recalculate(){
    $('#recalc').click(function(event){
        $('.caloriesScreen').addClass('hidden');
        $('.calorieCalculator').removeClass('hidden');
    })
}

function showList(){
    $('#begin').click(function(event){
        $('.caloriesScreen').addClass('hidden');
        $('.input').removeClass('hidden');
        $('.total').html(`Remaining calories: ${bmr}`);
        getFoodList();
    });
}

function updateRemaining(){
    $('.total').html(`Remaining calories: ${bmr}`);
}

//jwt requests
function userLoginPost(item){
    $.ajax({
        method: 'POST',
        url: '/api/auth/login',
        data: JSON.stringify(item),
        success: validateToken,
        error: function(){
            alert('Username or password is incorrect');
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function validateToken(data){
    token = data.authToken;
    let decoded = jwt_decode(token);
    userId = decoded.user.username;
    if(token){
        $('#welcome').addClass('hidden');
        $('.calorieCalculator').removeClass('hidden');
        $('#logout').removeClass('hidden');
    }else{
        console.log('token not sent');
    }
}

function addFoodItem(item){
        $.ajax({
            method: 'POST',
            url: '/foodList',
            headers: {
                'Authorization':`Bearer ${token}`
            },
            data: JSON.stringify(item),
            success: function(data){
                getFoodList();
                bmr = bmr - data.calories;
                console.log(bmr);
                console.log(data.calories);
                updateRemaining();
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
                    calories: $(event.currentTarget).find('#newFoodCalories').val(),
                    user: userId
            });
        });
}

let foodItemTemp = (`
    <li class="foodItem">
        <p class="foodName"></p>
        <input class="updateName hidden" type="text" required><br>
        <p class="foodCalories"></p>
        <input class="updateCalories hidden" type="text" required><br>
        <p class="foodDate"></p>
        <div class="buttons">
        <button id="update" class="hidden">Update</button>
        <button id="edit">Edit</button>
        <button id="delete">Delete</button>
        </div>
    </li>
`);

function handleEditClick(){
    $('.log').on('click', '#edit', function(event){
        $(event.currentTarget).parent().parent().find('.foodName').addClass('hidden');
        $(event.currentTarget).parent().parent().find('.foodCalories').addClass('hidden');
        $(event.currentTarget).parent().parent().find('.updateName').removeClass('hidden');
        $(event.currentTarget).parent().parent().find('.updateCalories').removeClass('hidden');
        $(event.currentTarget).parent().find('#update').removeClass('hidden');
        $(event.currentTarget).parent().find('#edit').addClass('hidden');
        let id = $(event.currentTarget).closest('.foodItem').attr('id');
        console.log($(event.currentTarget).parent().find('.updateCalories'));
        $('.log').on('click', '#update', function(event){
            console.log('update clicked');
            console.log(id);
            updateFoodItem({
                id: id,
                name: $(event.currentTarget).parent().parent().find('.updateName').val(),
                calories: $(event.currentTarget).parent().parent().find('.updateCalories').val()
            })
        })
    })
}

function updateFoodItem(item){
    console.log(item);
    $.ajax({
        url: `/foodList/${item.id}/`,
        method: 'PUT',
        headers: {
            'Authorization':`Bearer ${token}`
        },
        data: JSON.stringify(item),
        success: getFoodList,
        dataType: 'json',
        contentType: 'application/json'
    });
}

function getFoodList(){
    $.ajax({
        method: 'GET',
        url: `/foodList/forUser/${userId}`,
        headers: {
            'Authorization':`Bearer ${token}`
        },
        success: function(data){
            let foodElements = data.foods.map(function(food){
                element = $(foodItemTemp);
                element.attr('id', food.id);
                element.attr('calories', food.calories);
                let foodName = element.find('.foodName');
                foodName.text(food.name);
                let foodNameInput = element.find('.updateName');
                foodNameInput.val(food.name);
                let foodCalories = element.find('.foodCalories');
                foodCalories.text(food.calories);
                let foodCaloriesInput = element.find('.updateCalories');
                foodCaloriesInput.val(food.calories);
                let foodDate = element.find('.foodDate');
                foodDate.text(food.date);
                return element
            });
            $('.log').html(foodElements);
            handleEditClick();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function sort(){
    $('#sort').click(function(event){
        if($(event.currentTarget).val() === "name1" || "calories1" || "date1"){
            getFoodListSorted1($(event.currentTarget).val());
        }else{
            getFoodListSorted2($(event.currentTarget).val());
        }
    })
}

function getFoodListSorted1(sort){
    $.ajax({
        method: 'GET',
        url: `/foodList/forUser/${userId}/asc/${sort}`,
        headers: {
            'Authorization':`Bearer ${token}`
        },
        success: function(data){
            let foodElements = data.foods.map(function(food){
                element = $(foodItemTemp);
                element.attr('id', food.id);
                element.attr('calories', food.calories);
                let foodName = element.find('.foodName');
                foodName.text(food.name);
                let foodNameInput = element.find('.updateName');
                foodNameInput.val(food.name);
                let foodCalories = element.find('.foodCalories');
                foodCalories.text(food.calories);
                let foodCaloriesInput = element.find('.updateCalories');
                foodCaloriesInput.val(food.calories);
                let foodDate = element.find('.foodDate');
                foodDate.text(food.date);
                return element
            });
            $('.log').html(foodElements);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function getFoodListSorted2(sort){
    $.ajax({
        method: 'GET',
        url: `/foodList/forUser/${userId}/dsc/${sort}`,
        headers: {
            'Authorization':`Bearer ${token}`
        },
        success: function(data){
            let foodElements = data.foods.map(function(food){
                element = $(foodItemTemp);
                element.attr('id', food.id);
                element.attr('calories', food.calories);
                let foodName = element.find('.foodName');
                foodName.text(food.name);
                let foodNameInput = element.find('.updateName');
                foodNameInput.val(food.name);
                let foodCalories = element.find('.foodCalories');
                foodCalories.text(food.calories);
                let foodCaloriesInput = element.find('.updateCalories');
                foodCaloriesInput.val(food.calories);
                let foodDate = element.find('.foodDate');
                foodDate.text(food.date);
                return element
            });
            $('.log').html(foodElements);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteFoodItem(itemId, itemCalories){
    $.ajax({
        method: 'DELETE',
        url: `foodList/${itemId}`,
        headers: {
            'Authorization':`Bearer ${token}`
        },
        success: function(){
            console.log(bmr);
            console.log(itemCalories);
            bmr = bmr + parseInt(itemCalories);
            updateRemaining();
            getFoodList();
        }
    });
}

function handleDelete(){
    $('.log').on('click', '#delete', function(event){
        event.preventDefault();
        deleteFoodItem(
            $(event.currentTarget).closest('.foodItem').attr('id'),
            $(event.currentTarget).closest('.foodItem').attr('calories')
        );
    });
}




function userSignUpPost(item){
    $.ajax({
        method: 'POST',
        url: '/api/users',
        data: JSON.stringify(item),
        success: function(data){
            console.log(data);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function userSignUp(){
    $('#userSignUp').submit(function(event){
        event.preventDefault();
        $('#userSignUp').addClass('hidden');
        $('#userLogin').removeClass('hidden');
        $('.afterSignUp').removeClass('hidden');
        userSignUpPost({
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            username: $(event.currentTarget).find('#username').val(),
            password: $(event.currentTarget).find('#password').val()
        });
    });
}

$(function(){
    begin();
    userSignUp();
    userSignUpPost();
    handleDelete();
    handleFoodItemAdd();
    sort();
    calorieCalculator();
    showList();
    recalculate();
    userLogout();
    userLoginSubmit();
    yesOrNoUser();
});