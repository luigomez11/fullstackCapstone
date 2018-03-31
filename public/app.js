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