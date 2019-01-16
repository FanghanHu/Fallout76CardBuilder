//////////////////////////////////////////////////
$(function () {
    loadData();

});
//////////////////////////////////////////////////

var SpecialEnum = {
    STRENGTH: 0,
    PERCEPTION: 1,
    ENDURANCE: 2,
    CHARISMA: 3,
    INTELLIGENCE: 4,
    AGILITY: 5,
    LUCK: 6,
    color: {
        0: "#618869",
        1: "#595034",
        2: "#5CA7AF",
        3: "#CA7336",
        4: "#929175",
        5: "#C18768",
        6: "#9390A4"
    }
}

var dictionary = "qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM1234567890";

//Stores cards that haven't been selected
var selectable = [[],[],[],[],[],[],[]];

//Stores cards that have been selected.
var selected = [[],[],[],[],[],[],[]];

/**
 * loads card data from json file.
 * runs at the initialization phase of this web page.
 */
function loadData() {
    //fetching data using ajax
    $.ajax("./data.json",{
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        //populate data into selectable
        for(var i = 0; i < 7; i++) {
            for(var j = 0; j < data[i].length; j++) {
                var perk = data[i][j];
                //represent which special stat this perk card belongs.
                perk.special = i;
                selectable[i].push(perk);
            }
        }
    })
}