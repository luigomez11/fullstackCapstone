let mockData = {
    "calories": [
        {
            "food": "banana",
            "calories": 105,
            "date": "Tuesday, March 27, 2018",
            "time": "9:00 AM"
        },
        {
            "food": "outmeal",
            "calories": 158,
            "date": "Tuesday, March 27, 2018",
            "time": "10:00 AM"
        },
        {
            "food": "bagel",
            "calories": 245,
            "date": "Tuesday, March 27, 2018",
            "time": "11:00 AM"
        }
    ]
};

function getUserInput(display){
    setTimeout(function(){display(mockData)}, 100);
};

function displayUserInput(data){
    for(index in data.calories){
        $('body').append(
            '<p>' + data.calories[index].text + '</p>'
        );
    };
};

function getAndDisplayUserInput(){
    getUserInput(displayUserInput);
};

$(function(){
    getAndDisplayUserInput();
})