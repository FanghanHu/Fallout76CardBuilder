//TODO: perk card data
var SpecialEnum = {
    STRENGTH : 1,
    PERCEPTION : 2,
    ENDURANCE : 3,
    CHARISMA : 4,
    INTELLIGENCE : 5,
    AGILITY : 6,
    LUCK : 7
}

class PerkCard {
    constructor(cost, name, desc, level, special) {
        this.cost = cost;
        this.name = name;
        this.desc = desc; //the size of this desc array also indicates how many level this card has.
        this.level = level;
        this.special = special;
    }
    
    /*
        creates a html element
    */
    createElement() {
        let element = document.createElement("div");
        element.className="perk-card";
        
        let background = "";
        switch(this.special) {
            case SpecialEnum.STRENGTH : background = " bg-s";
                break;
            case SpecialEnum.PERCEPTION : background = " bg-p";
                break;
            case SpecialEnum.ENDURANCE : background = " bg-e";
                break;
            case SpecialEnum.CHARISMA : background = " bg-c";
                break;
            case SpecialEnum.INTELLIGENCE : background = " bg-i";
                break;
            case SpecialEnum.AGILITY : background = " bg-a";
                break;
            case SpecialEnum.LUCK : background = " bg-l";
                break;
            default:
                background = "";
        }
        let titleElement = document.createElement("div");
        titleElement.className = "card-title" + background;
        element.appendChild(titleElement);
        
        let costElement = document.createElement("span");
        costElement.className = "cost";
        costElement.innerHTML = this.cost;
        titleElement.appendChild(costElement);
        
        let nameElement = document.createElement("span");
        nameElement.className = "card-name";
        nameElement.innerHTML = this.name;
        titleElement.appendChild(nameElement);
        
        let descElement = document.createElement("div");
        descElement.className = "card-desc";
        descElement.innerHTML = this.desc[this.level-1];
        element.appendChild(descElement);
        
        let starFieldElement = document.createElement("div");
        starFieldElement.className = "star-field";
        for(let i=0; i<this.desc.length; i++) {
            let starElement = document.createElement("span");
            starElement.innerHTML = "&#9733;";
            starElement.className = "star";
            if(i < this.level) {
                starElement.className += " star-active";
            }
            starFieldElement.appendChild(starElement);
        }
        element.appendChild(starFieldElement);
        
        return element;
    }
}

var cards = [
    [//s
        new PerkCard(1, "test card", ["test desc1", "test desc2"], 1, SpecialEnum.STRENGTH)
    ],
    [//p
        
    ],
    [//e
        
    ],
    [//c
        
    ],
    [//i
        
    ],
    [//a
        
    ],
    [//l
        
    ]
];

//perk card element constructor
function test () {
    let perk = cards[0][0];
    let element = perk.createElement();
    
    document.body.appendChild(element);
    
    console.log(element);
}