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

    /**
     * show leveled card info when hovering on stars.
     */
    $("#perk-section").delegate(".star", "mouseenter", null, function () {
        var displayLevel = $(this).index() + 1;
        updateLevel(this.closest(".perk-card"), displayLevel);
    });
    $("#card-selection").delegate(".star", "mouseenter", null, function () {
        var displayLevel = $(this).index() + 1;
        updateLevel(this.closest(".perk-card"), displayLevel);
    });
    $("#perk-section").delegate(".star", "mouseleave", null, function () {
        updateLevel(this.closest(".perk-card"), undefined);
    });
    $("#card-selection").delegate(".star", "mouseleave", null, function () {
        updateLevel(this.closest(".perk-card"), undefined);
    });

    /**
     * TODO: update card level on clicking stars
     * Note: check stats requirement when clicking in perk-deck, consider touch event
     */

    /**
     * TODO: select card when clicking in #card-selection
     */

    /**
     * TODO: remove card when clicking a remove button in #perk-deck
     */
}

/**
 * Change the card level of the given card element(UI), also updates the element's related cardData
 * Should not be used on
 * @param cardElement
 * @param level
 * @param isRealLevel change
 */
function updateLevel(cardElement, level, isRealLevel) {
    var $cardElement = $(cardElement);
    var cardData = $cardElement.data("cardData");
    if(isRealLevel) {
        if(cardData.level !== level) {
            cardData.level = level;
            $cardElement.replaceWith(createCardElement(cardData));
        }
    } else {
        if(cardData.displayLevel !== level) {
            cardData.displayLevel = level;
            $cardElement.replaceWith(createCardElement(cardData));
        }
    }
}

/**
 * add the given card to the given array, if the a data set with the same card name exists, replace it.
 * if multiple card with the same name existed, replace the first one, and remove the rest.
 * @param card
 * @param array
 */
function addCardToArray(card, array) {
    var found = false;
    for(var i = 0; i < array.length; i++) {
        var cardData = array[i];
        if(cardData.name === card.name) {
            if(!found) {
                found = true;
                array[i] = card;
            } else {
                array.splice(i, 1);
                i--;
            }
        }
    }

    if(!found) {
        array.push(card);
    }
}

/**
 * remove the given card from given array, if such card doesn't exist, do nothing.
 * @param card
 * @param array
 */
function removeCardFromArray(card, array) {
    var result = array.filter(function (cardData) {
        return cardData.name !== card.name;
    });
    //clear array
    array.length = 0;
    //push all values of result into array
    Array.prototype.push.apply(array, result);
}

/**
 * show the set of selectable cards from the given special in the selection area.
 * @param special SpecialEnum values.
 */
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
            var level = getDisplayLevel(cardData);
            return cardData.initialCost + level - 1;
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
        var level = getDisplayLevel(cardData);
        return cardData.desc[level-1];
    }

    return "error reading card description."
}

/**
 * Create an card element using the given card data
 * @param cardData
 */
function createCardElement(cardData) {
    var card = document.createElement("div");
    //All card elements carry cardData
    $(card).data("cardData", cardData);

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

    //TODO: add a remove button in card body and style it in css, make it only appear in .perk-deck

    var cardFooter = document.createElement("div");
    cardFooter.className = "perk-card-footer";
    card.appendChild(cardFooter);

    var level = getDisplayLevel(cardData);

    if(cardData.hasOwnProperty("desc") && cardData.hasOwnProperty("level")) {
        for(var i = 0; i < cardData.desc.length; i++)
        {
            var star = document.createElement("i");
            star.className = "fas fa-star star";
            if(i < level)
            {
                star.className += " active-star";
            }
            cardFooter.appendChild(star);
        }
    }

    return card;
}

/**
 * if the card has a displayLevel return it, else return level instead.
 * @param cardData
 * @return number
 */
function getDisplayLevel(cardData) {
    var level = cardData.level;
    if(cardData.hasOwnProperty("displayLevel") && cardData.displayLevel !== undefined) {
        level = cardData.displayLevel;
    }
    return level;
}

/**
 * Move a card from selectable to selected and update stats.
 * Note: Check return value before updating UI.
 * This function does NOT handle the UI.
 * This function assume the given card can be selected, and selected array doesn't contain such card.
 * @param cardData
 * @return number 0 if stats condition allows this action, -1 if there isn't enough special stats and this card can't be added.
 * -2 if there isn't enough ability points left
 */
function selectCard(cardData) {
    //calculate stats
    var cost = getCost(cardData);
    //other card's cost
    var otherCost = 0;
    selected[cardData.special].each(function (card) {
        otherCost+=getCost(card);
    })
    if(cost + otherCost > 15) {
        //when total stats points will exceed 15
        return -1;
    }
    var pointCost = cost - special[cardData.special] + otherCost;
    if(pointCost > points) {
        //when there isn't enough ability point left
        return 2;
    }
    //adding the card, and update stats
    points-=pointCost;
    special[cardData.special] = otherCost + cost;
    removeCardFromArray(cardData, selectable[cardData.special]);
    addCardToArray(cardData, selected[cardData.special]);
}

/**
 * Deselect card and recalculate stats
 * This function does NOT handle UI
 * This function assume the selected array contains 1 given card, and only contain one copy.
 * @param cardData
 */
function deselectCard(cardData) {
    var cost = getCost(cardData);
    while(special[cardData.special] - cost < 1){
        cost--;
    }
    special[cardData.special] -= cost;
    points[cardData.special] += cost;
    removeCardFromArray(cardData, selected[cardData.special]);
    addCardToArray(cardData, selectable[cardData.special]);
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