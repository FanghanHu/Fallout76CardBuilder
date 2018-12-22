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
    constructor (cost, name, desc, level, special) {
        this.cost = cost;
        this.name = name;
        this.desc = desc;
        this.level = level;
        this.special = special;
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
    console.log(cards[0][0]);
}