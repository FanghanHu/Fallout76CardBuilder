//////////////////////////////////////////////////
$(function () {
    loadData();
    init();

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
    },
    name: {
        0: "strength",
        1: "perception",
        2: "endurance",
        3: "charisma",
        4: "intelligence",
        5: "agility",
        6: "luck"
    }
};

//used for wrapping selection data into url
var dictionary = "qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM1234567890";

//Stores cards that haven't been selected
var selectable = [[],[],[],[],[],[],[]];

//Stores cards that have been selected.
var selected = [[],[],[],[],[],[],[]];

//the special stats, each selected card cost
var special = [1, 1, 1, 1, 1, 1, 1];

//the perk points left, selecting a perk card cost [the cost amount + card level - 1] points.
var points = 49;

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
                perk.level = 1;
                selectable[i].push(perk);
            }
            showSelectableCards(SpecialEnum.STRENGTH);
        }
    })
}

/**
 * setup events
 */
function init() {

    /**
     * show selectable cards when clicking a stats card.
     */
    $("#stats-section").delegate(".stats-card", "click", function () {
        showSelectableCards($(this).index());
    })


}

function showSelectableCards(special) {
    var fadeTime = 100;
    var $cardSelection = $("#card-selection");
    $cardSelection.empty();
    for(var i = 0; i < selectable[special].length; i++) {
        var card = createCardElement(selectable[special][i]);
        $cardSelection.append(card);
        $(card).hide().fadeIn(fadeTime);
        fadeTime+=100;
    }
}

/**
 * using an hidden element to copy link into user's clipboard
 */
function copyLink() {
    var copyText = document.getElementById("url-selector");
    copyText.value = window.location.href;
    copyText.select();
    document.execCommand("copy");
    alert("已复制包含加点内容的连接:\n" + copyText.value);
}

/**
 * returns the actual amount of cost of a given cost
 * @param cardData
 */
function getCost(cardData) {
    if(cardData.hasOwnProperty("initialCost"))
    {
        if(cardData.hasOwnProperty("level"))
        {
            return cardData.initialCost + cardData.level - 1;
        }

        return cardData.initialCost;
    }

    return undefined;
}

/**
 * @param cardData the card's data, a card level is expected to present
 * @returns string description depends on card level
 */
function getDescription(cardData) {
    if(cardData.hasOwnProperty("desc") && cardData.hasOwnProperty("level")) {
        return cardData.desc[cardData.level-1];
    }

    return "error reading card description."
}

/**
 * Create an card element using the given card data
 * @param cardData
 */
function createCardElement(cardData) {
    var card = document.createElement("div");
    $(card).data("cardData", cardData);

    // function for adding or removing cardData from array
    // $(card).on("click", function () {
    //    selectable[cardData.special].splice($.inArray($(card).data("cardData"), selectable[cardData.special]), 1);
    //    showSelectableCards(cardData.special);
    // });

    card.className = "perk-card";
    if(cardData.hasOwnProperty("special")) {
        card.className += " " + SpecialEnum.name[cardData.special];
    }

    var cardHeader = document.createElement("div");
    cardHeader.className = "perk-card-header";
    card.appendChild(cardHeader);

    var cardCost = document.createElement("span");
    cardCost.className = "perk-card-cost";
    cardCost.textContent = getCost(cardData);
    cardHeader.appendChild(cardCost);


    var cardName = document.createElement("span");
    cardName.className = "perk-card-name";
    cardName.textContent = cardData.name;
    cardHeader.appendChild(cardName);

    var cardBody = document.createElement("div");
    cardBody.className = "perk-card-body";
    card.appendChild(cardBody);

    var desc = document.createElement("p");
    desc.textContent = getDescription(cardData);
    cardBody.appendChild(desc);

    var cardFooter = document.createElement("div");
    cardFooter.className = "perk-card-footer";
    card.appendChild(cardFooter);

    if(cardData.hasOwnProperty("desc") && cardData.hasOwnProperty("level")) {
        for(var i = 0; i < cardData.desc.length; i++)
        {
            var star = document.createElement("i");
            star.className = "fas fa-star star";
            if(i < cardData.level)
            {
                star.className += " active-star";
            }
            cardFooter.appendChild(star);
        }
    }

    return card;
}

/**
 * move a card from selectable to selected, point calculation should be done here
 * @param card
 */
function selectCard(card) {

}

function deselectCard(card) {

}

/**
 * update
 */
function updateBuild() {

}

/**
 * update url link to save build information
 */
function updateURL() {

}

/**
 * process the url parameters to load saved build
 */
function processURL() {

}