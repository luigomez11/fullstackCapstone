function getUserInput(display){
    $.getJSON('/foodlist', displayUserInput)
};

function displayUserInput(data){
    console.log(data);
    data.foods.forEach(function(item){
        for(key in item){
            $('body').append(
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
})

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