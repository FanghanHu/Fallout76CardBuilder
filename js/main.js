/*jslint es6:true*/
const SpecialEnum = {
    STRENGTH : 1,
    PERCEPTION : 2,
    ENDURANCE : 3,
    CHARISMA : 4,
    INTELLIGENCE : 5,
    AGILITY : 6,
    LUCK : 7,
    properties : {
        1 : {background : "bg-s", color : "color-s", deck : "s-deck", point : "s-amount"},
        2 : {background : "bg-p", color : "color-p", deck : "p-deck", point : "p-amount"},
        3 : {background : "bg-e", color : "color-e", deck : "e-deck", point : "e-amount"},
        4 : {background : "bg-c", color : "color-c", deck : "c-deck", point : "c-amount"},
        5 : {background : "bg-i", color : "color-i", deck : "i-deck", point : "i-amount"},
        6 : {background : "bg-a", color : "color-a", deck : "a-deck", point : "a-amount"},
        7 : {background : "bg-l", color : "color-l", deck : "l-deck", point : "l-amount"}
    }
};

// the array for storing perk card data.
const cards = [[], [], [], [], [], [], []];
// the array for storing selected cards
const selectedDecks = [[], [], [], [], [], [], []];

class PerkCard {
    constructor(id,cost, name, desc, level, special,attribute) {
        this.cost = cost;
        this.name = name;
        this.desc = desc; // the size of this desc array also indicates how
							// many level this card has.
        this.level = level;
        this.special = special;
        this.isSelected = false;
        this.oldLevel = null;
        // noinspection JSUnusedGlobalSymbols
        this.id = -1;
        this.myid=id;
        this.attribute=attribute;
    }
    
    /*
	 * creates a html element
	 */
    createElement() {
        let element = document.createElement("div");
        let ref = this;
        let selectionElement = document.getElementById("card-selections");
        
        
        element.className="perk-card";
        let background = SpecialEnum.properties[this.special].background;
        let color = SpecialEnum.properties[this.special].color;
        
        let titleElement = document.createElement("div");
        titleElement.className = "card-title " + background;
        element.appendChild(titleElement);
        
        let costElement = document.createElement("span");
        costElement.className = "cost";
        titleElement.appendChild(costElement);
        
        let nameElement = document.createElement("span");
        nameElement.className = "card-name";
        nameElement.innerHTML = this.name;
        titleElement.appendChild(nameElement);
        
        let descElement = document.createElement("div");
        descElement.className = "card-desc";
        element.appendChild(descElement);
        
        let starFieldElement = document.createElement("div");
        starFieldElement.className = "star-field";
        element.appendChild(starFieldElement);
        
        updateInfo();
        
        element.onclick = function() {
            if(!ref.isSelected && hasEnoughPoints(ref.cost + ref.level - 1)) {
                
                // select a card when clicking on it.
                selectionElement.removeChild(element);
                let deckId = SpecialEnum.properties[ref.special].deck;
                let deckElement = document.getElementById(deckId);
                deckElement.appendChild(element);
                ref.isSelected = true;
                selectCard(ref);
                updatePoints();
                return;
            }
            
            if(ref.isSelected) {
                let deckId = SpecialEnum.properties[ref.special].deck;
                let deckElement = document.getElementById(deckId);
                deckElement.removeChild(element);
                ref.isSelected = false;
                deselectCard(ref);
                updatePoints();
                showCards(ref.special);
            }
            
        };

        
        /*
		 * return true if there is still enough points
		 */
        function hasEnoughPoints(cost) {
            let totalDeckPoints = 0;
            let totalSpecial = 0;
            let deckElement = document.getElementById(SpecialEnum.properties[ref.special].deck);
            let costs = deckElement.getElementsByClassName("cost");
            for(let i = 0; i < costs.length; i++) {
                let costElement = costs[i];
                totalDeckPoints += parseInt(costElement.innerHTML);
            }
            
            if((ref.isSelected && totalDeckPoints > 15) || (!ref.isSelected && totalDeckPoints + cost > 15)) {
                alert("单一属性最高只能加到15点.");
                return false;
            }
            
            let decksElement = document.getElementById("specials");
            let totalCosts = decksElement.getElementsByClassName("special-amount");
            for(let i = 0; i < totalCosts.length; i++) {
                let costElement = totalCosts[i];
                totalSpecial += parseInt(costElement.innerHTML);
            }
            
            if(costs.length===0) {
                cost--;
            }
            
            if(totalSpecial + cost > 56) {
                alert("剩余点数不足.");
                return false;
            }
            
            return true;
        }

        
        /*
		 * update card cost, desc, star highlight, and star hovering functions.
		 */
        function updateInfo() {
            costElement.innerHTML = ref.cost + ref.level - 1;
            descElement.innerHTML = ref.desc[ref.level-1];
            while(starFieldElement.firstChild) {
                starFieldElement.removeChild(starFieldElement.firstChild);
            }
            
            for(let i=0; i<ref.desc.length; i++) {
                let starElement = document.createElement("span");
                starElement.innerHTML = "&#9733;";
                starElement.className = "star ";
                if(i < ref.level) {
                    starElement.className += color;
                }

                if(i !== ref.level - 1) {
                    // change card to other level here:
                    starElement.onmouseenter = function() {
                        if(ref.oldLevel == null) ref.oldLevel = ref.level;
                        ref.level = i + 1;
                        updateInfo();
                    };

                }
                else {
                    // change level back to original on mouse leave
                    element.onmouseout = function() {
                        // console.log("out: " + ref.oldLevel);
                        if(ref.oldLevel != null) {
                            ref.level = ref.oldLevel;
                            updateInfo();
                        }

                    };

                    // change the level when on click
                    starElement.onclick = function() {
                        // console.log("click: " + (i + 1));
                        
                        if(ref.isSelected) {
                            
                            if(hasEnoughPoints((i + 1) - ref.oldLevel)) {
                                ref.level = i + 1;
                                ref.oldLevel = null;
                                updateInfo();
                                updatePoints();
                                event.stopPropagation();
                            }
                        }
                        else {
                            ref.level = i + 1;
                            ref.oldLevel = null;
                            updateInfo();
                        }
                        
                    };
                }

                starFieldElement.appendChild(starElement);
            }
        }
        return element;
    }
    
    /*
	 * add this card into the cards array
	 */
    init() {
        this.id = cards[this.special-1].length;
        cards[this.special-1].push(this);
    }
}

// /////////////////////////////////////////////////////////////////////////////////

initCards();
window.onload = function() {
    showCards(SpecialEnum.STRENGTH);
    handleVariable();
};

// /////////////////////////////////////////////////////////////////////////////////

/*
 * initialize all the perk cards
 */
function initCards() { 
	$.getJSON("PerkCardData.json",function(data){ 
		for (var i = 0; i < data.length; i++) {
			switch (data[i].cardType)
			{
			case 1:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.STRENGTH,data[i].attribute).init();
			  break;
			case 2:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.PERCEPTION,data[i].attribute).init();
			  break;
			case 3:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.ENDURANCE,data[i].attribute).init();
			  break;
			case 4:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.CHARISMA,data[i].attribute).init();
			  break;
			case 5:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.INTELLIGENCE,data[i].attribute).init();
			  break;
			case 6:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.AGILITY,data[i].attribute).init();
			  break;
			case 7:
				new PerkCard(i,data[i].cost,data[i].name,data[i].level,data[i].special,SpecialEnum.LUCK,data[i].attribute).init();
			  break;
			}
		}
	}) 
}

/**
 * show the perk cards in the card selection area.
 */
function showCards(special) {
    let selectionElement = document.getElementById("card-selections");
    // remove all children
    while(selectionElement.firstChild) {
        selectionElement.removeChild(selectionElement.firstChild);
    }
    
    // cards for a selected special stat
    let specialCards = cards[special-1];
    
    for(let i = 0; i < specialCards.length; i++) {
        // create a card element
        let perkCard = specialCards[i];
        if(!perkCard.isSelected) {
            let element = perkCard.createElement();
            selectionElement.appendChild(element);
        }
    }
}

function updatePoints() {
    for(let special = 1; special <= 7; special++) {
        let totalDeckPoints = 0;
        let deckElement = document.getElementById(SpecialEnum.properties[special].deck);
        let costs = deckElement.getElementsByClassName("cost");
        for(let i = 0; i < costs.length; i++) {
            let costElement = costs[i];
            totalDeckPoints += parseInt(costElement.innerHTML);
        }
        if(totalDeckPoints === 0) {
            totalDeckPoints = 1;
        }
        let pointElement = document.getElementById(SpecialEnum.properties[special].point);
        pointElement.innerHTML = totalDeckPoints+"";
    }

    let totalSpecial = 0;
    let decksElement = document.getElementById("specials");
    let totalCosts = decksElement.getElementsByClassName("special-amount");
    for(let i = 0; i < totalCosts.length; i++) {
        let costElement = totalCosts[i];
        totalSpecial += parseInt(costElement.innerHTML);
    }
    let pointsElement = document.getElementById("points");
    pointsElement.innerHTML = (56 - totalSpecial);

    updateUrl();
}


// ///Saving state and loading state
// //////////////////////////////////////////////////////////

const dictionary = "qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM1234567890";

/**
 * only used for keeping track of what card is selected, doesn't actually move
 * elements around.
 * 
 * @param perkCard
 */
function selectCard(perkCard) {
    let specialId = perkCard.special - 1;
    let deck = selectedDecks[specialId];
    if(!deck.includes(perkCard)) {
        deck.push(perkCard);
    }
    calculation();
}

/**
 * only used for keeping track of what card is selected, doesn't actually move
 * elements around.
 * 
 * @param perkCard
 */
function deselectCard(perkCard) {
    let specialId = perkCard.special - 1;
    let deck = selectedDecks[specialId];
    let index = deck.findIndex((card) => card.id === perkCard.id);
    if(index >= 0) {
        deck.splice(index, 1);
    }
    calculation();
}

/**
 * return selected card special, id, and level in an array
 */
function getSelectionData() {
    let data = [];
    
    for(let special = 0; special < selectedDecks.length; special++) {
        for(let position = 0; position < selectedDecks[special].length; position++) {
            let perkCard = selectedDecks[special][position];
            data.push(special);
            data.push(perkCard.id);
            data.push(perkCard.level);
        }
    }
    return data;
}

/**
 * 计算卡牌累计伤害加成
 */
function calculation(){
	var sNum=$("#s-amount").html();
	var aNum=$("#a-amount").html();
	var weaponDamageVal=parseFloat($("#weaponDamageVal").val());
	
	var min=0;
	var max=0;
	var numMin=0;
	var numMax=0;
	if( isNaN(weaponDamageVal)){
		weaponDamageVal=1;
	}
	for(let special = 0; special < selectedDecks.length; special++) {
        for(let position = 0; position < selectedDecks[special].length; position++) {
            let perkCard = selectedDecks[special][position];
            var le=perkCard.level-1;
            if(perkCard.attribute.type==1&&perkCard.attribute.unionCardType!=0){
            	if (perkCard.attribute.unionCardType==1) {
            		numMin+=perkCard.attribute.levelValue[le].min*sNum;
				}
            	if (perkCard.attribute.unionCardType==6) {
            		numMin+=perkCard.attribute.levelValue[le].min*aNum;
            	}
            	if (perkCard.attribute.unionCardType==8) {
            		numMin+=perkCard.attribute.levelValue[le].min;
            	}
            	numMax+=perkCard.attribute.levelValue[le].max;
			}else if(perkCard.attribute.type==1){
				min+=perkCard.attribute.levelValue[le].min;
				max+=perkCard.attribute.levelValue[le].max;
			}
        }
    }
	var str=Math.round((weaponDamageVal+numMin)*(1+min))+"~"+Math.round((weaponDamageVal+numMax)*(1+max));
	if(min==max){
		$("#multiple").html(max.toFixed(2)*100+"%");
	}else{
		$("#multiple").html(min.toFixed(2)*100+"% ~ "+max.toFixed(2)*100+"%");
	}
	if(numMin==numMax&&min==max){
		$("#estimatedValue").html(Math.round((weaponDamageVal+numMin)*(1+min)));
	}else{
		$("#estimatedValue").html(str);
	}
	
	
}

/**
 * Parse selectionData into a long string
 * 
 * @param selectionData
 */
function parseSelectionData(selectionData) {
    if(selectionData == null) {
        return null;
    }

    let string = "";
    while(selectionData.length > 0) {
        let i = selectionData.shift();
        let c = dictionary.charAt(i);
        string+=c;
    }
    return string;
}

/**
 * parse a string into selection data.
 */
function parseString(string) {
    if(string == null) {
        return null;
    }

    let selectionData = [];
    for (let i = 0; i < string.length; i++) {
        // noinspection JSUnresolvedFunction
        let c = string.charAt(i);
        let num = dictionary.indexOf(c);
        selectionData.push(num);
    }
    return selectionData;
}

/**
 * read and process selectionData into selected perk cards. Since it is only
 * called in when the page is loaded, a clear deck action is not needed.
 * 
 * @param selectionData
 */
function readSelectionData(selectionData) {
    if(selectionData == null) {
        return;
    }

    while(selectionData.length > 0) {
        let special = selectionData.shift();
        let id = selectionData.shift();
        let level = selectionData.shift();
        let perkCard = cards[special][id];
        perkCard.level = level;
        perkCard.isSelected = true;
        let deckId = SpecialEnum.properties[perkCard.special].deck;
        let deckElement = document.getElementById(deckId);
        selectCard(perkCard);
        deckElement.appendChild(perkCard.createElement());
    }

    updatePoints();
    showCards(SpecialEnum.STRENGTH);
}

function handleVariable() {
    let string = getParameter();
    let selectionData = parseString(string);
    readSelectionData(selectionData);
}

/**
 * change the url to save selection data
 */
function updateUrl() {
    let selectionData = getSelectionData();
    let string = parseSelectionData(selectionData);
    setParameter(string);
}

/**
 * get data string from url
 */
function getParameter() {
    let url = new URL(window.location.href);
    return url.searchParams.get("data");
}

/**
 * put the data into address bar without reloading the page
 * 
 * @param parameter
 *            data string
 */
function setParameter(parameter) {
    window.history.replaceState(null, '辐射76加点模拟器', '?data=' + parameter);
}

function copyLink() {
    var copyText = document.getElementById("url-selector");
    copyText.value = window.location.href;
    copyText.select();
    document.execCommand("copy");
    alert("包含你的加点的网页链接已经复制到你的剪切板里了:" + copyText.value);
}