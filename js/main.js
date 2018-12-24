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

//the array for storing perk card data.
const cards = [[], [], [], [], [], [], []];

class PerkCard {
    constructor(cost, name, desc, level, special) {
        this.cost = cost;
        this.name = name;
        this.desc = desc; //the size of this desc array also indicates how many level this card has.
        this.level = level;
        this.special = special;
        this.isSelected = false;
        this.oldLevel = null;
    }
    
    /*
        creates a html element
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
                
                //select a card when clicking on it.
                selectionElement.removeChild(element);
                let deckId = SpecialEnum.properties[ref.special].deck;
                let deckElement = document.getElementById(deckId);
                deckElement.appendChild(element);
                ref.isSelected = true;
                updatePoints();
                return;
            }
            
            if(ref.isSelected) {
                let deckId = SpecialEnum.properties[ref.special].deck;
                let deckElement = document.getElementById(deckId);
                deckElement.removeChild(element);
                updatePoints();
                ref.isSelected = false;
                showCards(ref.special);
            }
            
        };
        
        function updatePoints() {
            let totalDeckPoints = 0;
            let deckElement = document.getElementById(SpecialEnum.properties[ref.special].deck);
            let costs = deckElement.getElementsByClassName("cost");
            for(let i = 0; i < costs.length; i++) {
                let costElement = costs[i];
                totalDeckPoints += parseInt(costElement.innerHTML);
            }
            if(totalDeckPoints === 0) {
                totalDeckPoints = 1;
            }
            let pointElement = document.getElementById(SpecialEnum.properties[ref.special].point);
            pointElement.innerHTML = totalDeckPoints+"";
            
            let totalSpecial = 0;
            let decksElement = document.getElementById("specials");
            let totalCosts = decksElement.getElementsByClassName("special-amount");
            for(let i = 0; i < totalCosts.length; i++) {
                let costElement = totalCosts[i];
                totalSpecial += parseInt(costElement.innerHTML);
            }
            let pointsElement = document.getElementById("points");
            pointsElement.innerHTML = (56 - totalSpecial);
        }

        
        /*
            return true if there is still enough points 
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
            update card cost, desc, star highlight, and star hovering functions.
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
                    //change card to other level here:
                    starElement.onmouseenter = function() {
                        //console.log("enter: " + (i + 1));
                        if(ref.oldLevel == null) ref.oldLevel = ref.level;
                        ref.level = i + 1;
                        updateInfo();
                    };

                }
                else {
                    //change level back to original on mouse leave
                    element.onmouseout = function() {
                        //console.log("out: " + ref.oldLevel);
                        if(ref.oldLevel != null) {
                            ref.level = ref.oldLevel;
                            updateInfo();
                        }

                    };

                    //change the level when on click
                    starElement.onclick = function() {
                        //console.log("click: " + (i + 1));
                        
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
        add this card into the cards array
    */
    init() {
        cards[this.special-1].push(this);
    }
}

///////////////////////////////////////////////////////////////////////////////////

initCards();
window.onload = function() {
    showCards(SpecialEnum.STRENGTH);
    handleVariable();
};

///////////////////////////////////////////////////////////////////////////////////

/*
    initialize all the perk cards
*/
function initCards() { 
    new PerkCard(1, "蛮人古古那", ["未装备动力装甲时, 每点力量+2点伤害以及能量抗性 (最高40点)", "未装备动力装甲时, 每点力量+3点伤害以及能量抗性 (最高60点)", "未装备动力装甲时, 每点力量+4点伤害以及能量抗性 (最高80点)"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "破坏者", ["枪托打击造成的伤害+25%, 并有5%的几率致残你的对手", "枪托打击造成的伤害+50%, 并有10%的几率致残你的对手"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "熊臂持枪", ["重型枪械的重量减轻30%", "重型枪械的重量减轻60%", "重型枪械的重量减轻90%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "重击者", ["现在你的双手近战武器造成的伤害+10%", "现在你的双手近战武器造成的伤害+15%", "现在你的双手近战武器造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "专家级重击者", ["现在你的双手近战武器造成的伤害+10%", "现在你的双手近战武器造成的伤害+15%", "现在你的双手近战武器造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "大师级重击者", ["现在你的双手近战武器造成的伤害+10%", "现在你的双手近战武器造成的伤害+15%", "现在你的双手近战武器造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "阻攻手", ["减少来自敌人近战攻击伤害15%", "减少来自敌人近战攻击伤害30%", "减少来自敌人近战攻击伤害45%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "子弹护盾", ["射击重型枪械时额外获得20伤害抗性", "射击重型枪械时额外获得40伤害抗性", "射击重型枪械时额外获得60伤害抗性"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "角斗士", ["现在你的单手武器造成伤害+10%", "现在你的单手武器造成伤害+15%", "现在你的单手武器造成伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "专家级角斗士", ["现在你的单手武器造成伤害+10%", "现在你的单手武器造成伤害+15%", "现在你的单手武器造成伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "大师级角斗士", ["现在你的单手武器造成伤害+10%", "现在你的单手武器造成伤害+15%", "现在你的单手武器造成伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "重枪手", ["现在你的非爆炸性重型枪械造成的伤害+10%", "现在你的非爆炸性重型枪械造成的伤害+15%", "现在你的非爆炸性重型枪械造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "专家级重枪手", ["现在你的非爆炸性重型枪械造成的伤害+10%", "现在你的非爆炸性重型枪械造成的伤害+15%", "现在你的非爆炸性重型枪械造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "大师级重枪手", ["现在你的非爆炸性重型枪械造成的伤害+10%", "现在你的非爆炸性重型枪械造成的伤害+15%", "现在你的非爆炸性重型枪械造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "门牙", ["你的近战武器无视对方25%的护甲", "你的近战武器无视对方50%的护甲", "你的近战武器无视对方75%的护甲"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "铁拳", ["现在你的拳击造成的伤害+10%", "现在你的拳击造成的伤害+15%", "现在你的拳击造成的伤害+20%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "子弹上膛", ["重型枪械填装速度提高10%", "重型枪械填装速度提高20%", "重型枪械填装速度提高30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "武术家", ["你的近战武器重量减少了20%,挥动速度提高10%", "你的近战武器重量减少了40%,挥动速度提高20%", "你的近战武器重量减少了60%,挥动速度提高30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "军火运输", ["爆炸物重量减轻30%", "爆炸物重量减轻60%", "爆炸物重量减轻90%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "仓鼠", ["所有垃圾物品的重量减少25%", "所有垃圾物品的重量减少50%", "所有垃圾物品的重量减少75%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "天堂路", ["穿着动力装甲时,向敌人冲刺可对敌人造成伤害和失衡", "穿着动力装甲时,向敌人冲刺可对敌人造成大量伤害, 并且能使他们失衡", "穿着动力装甲时,向敌人冲刺可对敌人造成巨大伤害, 并且能使他们失衡"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "散弹", ["散弹枪重量减少了30%, 填装速度提高10%", "散弹枪重量减少了60%, 填装速度提高20%", "散弹枪重量减少了60%, 填装速度提高30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "散弹抢手", ["现在你的散弹枪造成的伤害+10%", "现在你的散弹枪造成的伤害+20%", "现在你的散弹枪造成的伤害+30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "专家级散弹抢手", ["现在你的散弹枪造成的伤害+10%", "现在你的散弹枪造成的伤害+20%", "现在你的散弹枪造成的伤害+30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "大师级散弹抢手", ["现在你的散弹枪造成的伤害+10%", "现在你的散弹枪造成的伤害+20%", "现在你的散弹枪造成的伤害+30%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "虎背", ["负重上限+10", "负重上限+20", "负重上限+30", "负重上限+40"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "体格健壮", ["装甲比正常重量轻25%", "装甲比正常重量轻50%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "完全充能", ["穿着动力装甲冲刺的时候, 只消耗原来一半的聚变核心能量", "穿着动力装甲冲刺的时候, 不再消耗额外的聚变核心能量"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "旅行药房", ["所有药物(包括治疗针)的重量减少了30%", "所有药物(包括治疗针)的重量减少了60%", "所有药物(包括治疗针)的重量减少了90%"], 1, SpecialEnum.STRENGTH).init();
    new PerkCard(1, "子弹带", ["弹道武器的弹药重量减少了45%", "弹道武器的弹药重量减少了90%"], 1, SpecialEnum.STRENGTH).init();

    
    new PerkCard(2, "洞察力", ["你可以在VATS中查看各项目标的具体情况"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "突击队", ["基础战斗训练意味着自动步枪造成的伤害+10%", "基础战斗训练意味着自动步枪造成的伤害+15%", "基础战斗训练意味着自动步枪造成的伤害+20%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "专家级突击队", ["基础战斗训练意味着自动步枪造成的伤害+10%", "基础战斗训练意味着自动步枪造成的伤害+15%", "基础战斗训练意味着自动步枪造成的伤害+20%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "大师级突击队", ["基础战斗训练意味着自动步枪造成的伤害+10%", "基础战斗训练意味着自动步枪造成的伤害+15%", "基础战斗训练意味着自动步枪造成的伤害+20%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "集中火力", ["现在VATS会瞄准目标肢体, 集中火力以获得每次射击的精准性和伤害", "现在VATS会瞄准目标肢体, 集中火力可以让每次射击获得更高的精准性和伤害", "现在VATS会瞄准目标肢体, 集中火力可以让每次射击获得高精准性和伤害"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "百发百中", ["瞄准时, 所有手枪射程提高10%, 精准度提高", "瞄准时, 所有手枪射程提高20%, 精准度进一步提高", "瞄准时, 所有手枪射程提高30%, 精准度更进一步提高"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "杀虫剂", ["你的攻击无视所有昆虫25%的护甲", "你的攻击无视所有昆虫50%的护甲", "你的攻击无视所有昆虫75%的护甲"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "小心手雷", ["投掷武器的时候可以看见投掷弧线, 并且提高15%的投掷距离", "投掷武器的时候可以看见投掷弧线, 并且提高30%的投掷距离", "投掷武器的时候可以看见投掷弧线, 并且提高50%的投掷距离"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "荧光瞄具", ["对发光敌人的伤害+20%", "对发光敌人的伤害+40%", "对发光敌人的伤害+60%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "投弹兵", ["爆炸半径增加50%", "爆炸半径翻倍"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "地面进攻", ["现在自动步枪填装速度加快10%, 并获得更好的腰射精准度", "现在自动步枪填装速度加快20%, 并获得进一步的腰射精准度", "现在自动步枪填装速度加快30%, 并获得绝佳的腰射精准度"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "狙击高手", ["使用瞄具时, 你的步枪射程和精准度提高10%", "使用瞄具时, 你的步枪射程提高20%,和精准度进一步提高", "使用瞄具时, 你的步枪射程提高30%,和精准度绝佳"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "夜猫子", ["晚上6点至早上6点, 智力+1, 感知+1", "晚上6点至早上6点, 智力+2, 感知+2", "晚上6点至早上6点, 智力+3, 感知+3"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "屠夫之赐", ["当你搜索一具动物的尸体时, 有40%几率能找到额外的肉", "当你搜索一具动物的尸体时, 有60%几率能找到额外的肉", "当你搜索一具动物的尸体时, 有80%几率能找到额外的肉"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "折射镜", ["获得+10能量抗性", "获得+20能量抗性", "获得+30能量抗性", "获得+40能量抗性"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "步枪手", ["现在你的非自动步枪造成的伤害+10%", "现在你的非自动步枪造成的伤害+20%", "现在你的非自动步枪造成的伤害+30%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "专家级步枪手", ["现在你的非自动步枪造成的伤害+10%", "现在你的非自动步枪造成的伤害+20%", "现在你的非自动步枪造成的伤害+30%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "大师级步枪手", ["现在你的非自动步枪造成的伤害+10%", "现在你的非自动步枪造成的伤害+20%", "现在你的非自动步枪造成的伤害+30%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "双向飞碟射击", ["你的散弹枪的精准和弹药散步提升", "你的散弹枪的精准和弹药散步进一步提升", "你的散弹枪的精准和弹药散步极大提升"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "狙击手", ["在瞄准时获得更好的控制力, 屏住呼吸时间延长25%", "在瞄准时获得更好的控制力, 屏住呼吸时间延长50%", "在瞄准时获得更好的控制力, 屏住呼吸时间延长75%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "坦克杀手", ["使用步枪攻击时将无视目标12%的护甲, 并有3%几率能使地方陷入失衡状态", "使用步枪攻击时将无视目标24%的护甲, 并有6%几率能使地方陷入失衡状态", "使用步枪攻击时将无视目标36%的护甲, 并有9%几率能使地方陷入失衡状态"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "杂志收藏家", ["范围内有杂志时, 会听见提示音"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "感知娃娃", ["范围内有娃娃时, 会听见提示音"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "寻宝高手", ["范围内有瓶盖盒时, 会听见提示音"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "开锁", ["获得+1开锁技能, 并使开锁时的最佳范围提高10%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "专家级开锁", ["获得+1开锁技能, 并使开锁时的最佳范围提高10%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "大师级开锁", ["获得+1开锁技能, 并使开锁时的最佳范围提高10%"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(1, "园艺高手", ["收获植物的时候, 获得两倍收成"], 1, SpecialEnum.PERCEPTION).init();
    new PerkCard(2, "夜眸", ["在下午6点至早上6点潜行时获得夜视能力"], 1, SpecialEnum.PERCEPTION).init();
    
    
    new PerkCard(1, "超合金骨骼", ["你肢体收到的伤害现在减少30%", "你肢体收到的伤害现在减少60%", "你肢体现在完全不受伤害"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "通宵", ["你的饥饿和口渴耐性提高了20%", "你的饥饿和口渴耐性提高了40%", "你的饥饿和口渴耐性提高了60%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "食人族", ["食用人形生物可以恢复生命值和饥饿程度", "食用人形生物可以恢复更多的生命值和饥饿程度", "食用人形生物可以恢复极多的生命值和饥饿程度"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "嗜药恶魔", ["服用任何药物药效时间都增加30%", "服用任何药物药效时间都增加60%", "服用任何药物药效时间都增加100%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "药物抗性", ["服用药物时, 上瘾的机会降低一半", "你获得对药物上瘾的完全免疫力"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "可乐爱好者", ["核子可乐增益翻倍", "核子可乐增益为原先的三倍"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "单峰骆驼", ["所有饮料额外缓解25%的口渴程度", "所有饮料额外缓解50%的口渴程度", "所有饮料额外缓解75%的口渴程度"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "防火", ["立即获得+20的火焰抗性", "立即获得+40的火焰抗性", "立即获得+60的火焰抗性"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "尸鬼体质", ["受到辐射时可以使你损失的生命值得到恢复", "受到辐射时可以使你损失的生命值得到更多恢复", "受到辐射时可以使你损失的生命值得到极多的恢复"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "家里蹲", ["在营地或工坊中可以逐渐恢复生命值", "在营地或工坊中可以提高生命值并获得肢体再生"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "铁甲衣", ["当你没有穿动力装甲时获得10伤害和能量抗性", "当你没有穿动力装甲时获得20伤害和能量抗性", "当你没有穿动力装甲时获得30伤害和能量抗性", "当你没有穿动力装甲时获得40伤害和能量抗性", "当你没有穿动力装甲时获得50伤害和能量抗性"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "百毒不侵", ["你因进食而患病的几率减少30%", "你因进食而患病的几率减少60%", "你因进食而患病的几率减少90%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "铜肠铁胃", ["来自饮食的辐射降低30%", "来自饮食的辐射降低60%", "不会因为饮食而摄取辐射"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(2, "赐命者", ["增加15点最大生命值上限", "增加30点最大生命值上限", "增加45点最大生命值上限"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "克制口腹之欲", ["服用药物时减少50%饥饿值惩罚", "服用药物不再获得饥饿惩罚"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "环境抗性", ["你因周边环境而患病的几率减少30%", "你因周边环境而患病的几率减少60%", "你因周边环境而患病的几率减少90%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "夜之坚韧", ["晚上6点至早上6点, 最大生命值+20", "晚上6点至早上6点, 最大生命值+40"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "光合作用", ["在早上6点到晚上6点之间获得生命值恢复", "在早上6点到晚上6点之间获得更高生命值恢复"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "辐无敌", ["辐射程度越高, 力量越高(最多5点力量)"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "抗辐射", ["提升10点辐射抗性", "提升20点辐射抗性", "提升30点辐射抗性", "提升40点辐射抗性"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "精神百倍", ["在饱腹和水分充足时你会获得较多好处", "在饱腹和水分充足时你会获得极多好处"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "亡者归来", ["你被别的玩家复活时,可以在2分钟内获得+25%的伤害加成", "你被别的玩家复活时,可以在2分钟内获得+50%的伤害加成"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "慢速代谢剂", ["所有食物额外缓解25%的饥饿程度", "所有食物额外缓解50%的饥饿程度", "所有食物额外缓解75%的饥饿程度"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "太阳能供电", ["早上6点至晚上6点, 力量和耐力+1", "早上6点至晚上6点, 力量和耐力+2", "早上6点至晚上6点, 力量和耐力+3"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "太阳之吻", ["在早上6点到下午6点之间可以缓慢恢复辐射伤害", "在早上6点到下午6点之间可以快速恢复辐射伤害"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "解渴饮品", ["喝下液体引发疾病的概率降低30%", "喝下液体引发疾病的概率降低60%", "喝下液体引发疾病的概率降低90%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "接种疫苗", ["你从其他生物感染到疾病的几率减少30%", "你从其他生物感染到疾病的几率减少60%", "你从其他生物感染到疾病的几率减少90%"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "水男孩", ["游泳时你不再会收到辐射伤害, 并且可以在水下呼吸"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(3, "专职酒鬼", ["你绝不可能染上酒瘾"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "乖狗狗", ["吃狗粮可以获得三倍增益"], 1, SpecialEnum.ENDURANCE).init();
    new PerkCard(1, "修复水力发电", ["药物产生的口渴程度减低50%", "药物不再导致口渴"], 1, SpecialEnum.ENDURANCE).init();
    
    
    new PerkCard(1, "动物朋友", ["把你的枪对准任何低于你等级的动物, 会有25%的几率让它安静下来", "把你的枪对准任何低于你等级的动物, 会有50%的几率让它安静下来", "把你的枪对准任何低于你等级的动物, 会有75%的几率让它安静下来"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "保镖", ["除了你自己之外, 每位队友将使你获得6点伤害及能量抗性(最对18)", "除了你自己之外, 每位队友将使你获得8点伤害及能量抗性(最对24)", "除了你自己之外, 每位队友将使你获得10点伤害及能量抗性(最对30)", "除了你自己之外, 每位队友将使你获得12点伤害及能量抗性(最对36)"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "EMT", ["你复活的玩家将在15秒内获得生命恢复", "你复活的玩家将在30秒内获得更多的生命恢复", "你复活的玩家将在60秒内获得极多的生命恢复"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "充满魅力", ["每名队伍成员(除你自己之外) 为你增加1点魅力"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(2, "军医", ["治疗针和消辐宁生效更快"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "友谊之火", ["遭受你火焰攻击的队友会短暂地恢复生命值(不含汽油弹)", "遭受你火焰攻击的队友会短暂地恢复较多的生命值(不含汽油弹)", "遭受你火焰攻击的队友会短暂地恢复更多的生命值(不含汽油弹)"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "快乐露营者", ["身处己方队伍的工坊中时, 饥饿与口渴增长速度放缓40%", "身处己方队伍的工坊中时, 饥饿与口渴增长速度放缓80%"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "逍遥自在", ["受到酒精影响时, 你的运气+2", "受到酒精影响时, 你的运气+3"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "苛刻的交易", ["能在售卖机器人那里获得更加优惠的买卖价格", "能在售卖机器人那里获得非常优惠的买卖价格", "能在售卖机器人那里获得极端优惠的买卖价格"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "注射器", ["你复活的玩家10分钟内行动点恢复+6", "你复活的玩家10分钟内行动点恢复+12", "你复活的玩家10分钟内行动点恢复+18"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "激励", ["当你处组队状态中, 你和你的队友们可以获得5%的额外经验值", "当你处组队状态中, 你和你的队友们可以获得10%的额外经验值", "当你处组队状态中, 你和你的队友们可以获得15%的额外经验值"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(2, "独行侠", ["独自冒险时, 所受的伤害减少10%, 同时行动点数的恢复速度增加10%", "独自冒险时, 所受的伤害减少20%, 同时行动点数的恢复速度增加20%", "独自冒险时, 所受的伤害减少30%, 同时行动点数的恢复速度增加30%"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "过度慷慨", ["体内的辐射至将增加近身攻击对目标造成25点的辐射的几率", "体内的辐射至将增加近身攻击对目标造成50点的辐射的几率"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(2, "派对男孩", ["酒精的影响变为两倍", "酒精的影响变为三倍"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "慈善家", ["你在进食或者喝水时会为队友缓解部分饥饿与口渴", "你在进食或者喝水时会为队友缓解较多饥饿与口渴", "你在进食或者喝水时会为队友缓大量分饥饿与口渴"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "蒙古大夫", ["用酒精复活其他玩家"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "辐射海绵", ["受辐射影响时, 你可以周期性地为附近队友治疗80点辐射值", "受辐射影响时, 你可以周期性地为附近队友治疗140点辐射值", "受辐射影响时, 你可以周期性地为附近队友治疗200点辐射值"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "灵魂医者", ["复活其他玩家后5秒内你可以恢复生命值", "复活其他玩家后7秒内你可以恢复生命值", "复活其他玩家后10秒内你可以恢复生命值"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "小队机动", ["在小队中奔跑速度加快10%", "在小队中奔跑速度加快20%"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "消音器", ["击中目标后, 2秒内减少其10%的伤害输出", "击中目标后, 2秒内减少其20%的伤害输出", "击中目标后, 2秒内减少其30%的伤害输出"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "团队医护兵", ["你的治疗针现在也可以医疗附近的队友, 效果是正常的50%", "你的治疗针现在也可以医疗附近的队友, 效果是正常的75%", "你的治疗针现在也可以医疗附近的队友, 效果是正常的100%"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "松肉锤", ["使你的目标在攻击后5秒内收到5%的额外伤害", "使你的目标在攻击后7秒内收到6%的额外伤害", "使你的目标在攻击后10秒内收到7%的额外伤害"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "吸血生物", ["血浆包现在可以缓解口渴, 效果增加50%以上, 并且不再产生辐射", "血浆包现在可以缓解口渴, 效果增加100%以上, 并且不再产生辐射", "血浆包现在可以缓解口渴, 效果增加150%以上, 并且不再产生辐射"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "废土低语着", ["把你的枪对准任何低于你等级的生物, 会有25%的几率让它安静下来", "把你的枪对准任何低于你等级的生物, 会有50%的几率让它安静下来", "把你的枪对准任何低于你等级的生物, 会有75%的几率让它安静下来"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "旅行中介", ["进行快速移动时少付30%的瓶盖"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "卫生防疫", ["你的疾病被治愈时, 有50%的几率可以为附近的队友治疗一种疾病", "你的疾病被治愈时, 必然可以为附近的队友治疗一种疾病"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "多多益善", ["如果队友也有变异, 正面变异效果+25%"], 1, SpecialEnum.CHARISMA).init();
    new PerkCard(1, "治疗之手", ["你复活的玩家将消除所有辐射值"], 1, SpecialEnum.CHARISMA).init();
    
    
    new PerkCard(1, "装甲商", ["现在你可以制作高级护甲更改件(需要设计图)", "现在制作装甲的材料消耗减少", "你制作的护甲耐久性更高"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "内置电池", ["能量武器弹药的重量减轻30%", "能量武器弹药的重量减轻60%", "能量武器弹药的重量减轻90%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "承包商", ["工坊制造物品现在可以节约25%的材料", "工坊制造物品现在可以节约50%的材料"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "破坏专家", ["你的爆炸物造成额外的20%伤害", "你的爆炸物造成额外的40%伤害", "你的爆炸物造成额外的60%伤害", "你的爆炸物造成额外的80%伤害", "你的爆炸物造成额外的100%伤害"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "急救箱", ["治疗针可额外恢复15%", "治疗针可额外恢复30%", "治疗针可额外恢复45%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "修缮一新", ["你可以吧护甲和动力护甲的状态修复到标准最大值的130%", "你可以吧护甲和动力护甲的状态修复到标准最大值的160%", "你可以吧护甲和动力护甲的状态修复到标准最大值的200%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "枪械师", ["枪械损坏率降低10%, 并且你可以制造等级1的枪械 (需要设计图)", "枪械损坏率降低20%, 并且你可以制造等级2的枪械 (需要设计图)", "枪械损坏率降低30%, 并且你可以制造等级3的枪械 (需要设计图)", "枪械损坏率降低40%, 并且你可以制造等级4的枪械 (需要设计图)", "枪械损坏率降低50%, 并且你可以制造等级5的枪械 (需要设计图)"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "专业水管工", ["你的铁管武器损坏速度降低30%, 修复花费也更低", "你的铁管武器损坏速度降低60%, 修复花费也更低", "你的铁管武器损坏速度降低90%, 修复花费也更低"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "临时武士", ["近战武器损坏率降低10%, 并且你可以制造等级1的近战武器 (需要设计图)", "近战武器损坏率降低20%, 并且你可以制造等级2的近战武器 (需要设计图)", "近战武器损坏率降低30%, 并且你可以制造等级3的近战武器 (需要设计图)", "近战武器损坏率降低40%, 并且你可以制造等级4的近战武器 (需要设计图)", "近战武器损坏率降低50%, 并且你可以制造等级5的近战武器 (需要设计图)"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "忍无可忍", ["生命值低于20%时, 获得20伤害抗性, 10%伤害提升以及15%的行动点数恢复", "生命值低于20%时, 获得30伤害抗性, 15%伤害提升以及15%的行动点数恢复", "生命值低于20%时, 获得40伤害抗性, 20%伤害提升以及15%的行动点数恢复"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "移动能源", ["所有动力装甲和机架的重量减轻25%", "所有动力装甲和机架的重量减轻50%", "desc3所有动力装甲和机架的重量减轻75%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "药剂师", ["消辐宁可消除超过30%辐射", "消辐宁可消除超过60%辐射", "消辐宁可消除两倍的辐射"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "动力师", ["现在你可以制作高级动力装甲修改件(需要设计图)", "制作动力装甲的材料消耗减少", "你制作的动力装甲耐久性提高"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "动力使用者", ["聚变核心的持续时间延长30%", "聚变核心的持续时间延长60%", "现在巨变核心能持续两倍时间"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "机器人专家", ["黑入敌对机器人有25%的几率能让它平静下来", "黑入敌对机器人有50%的几率能让它平静下来", "黑入敌对机器人有75%的几率能让它平静下来"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "科学家", ["现在你可以制作能量枪(需要设计图)", "你可以制作1级能量枪械改装件(需要设计图)"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "专家级科学家", ["你可以制作2级能量枪械改装件(需要设计图)", "制作能量枪械消耗的材料减少"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "大师级科学家", ["你可以制作3级能量枪械改装件(需要设计图)", "你制作的能量枪耐久性提高"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "稳定", ["穿着动力装甲时, 重型枪械获得更高精准度, 并无视目标15%护甲", "穿着动力装甲时, 重型枪械获得进一步提高的精准度, 并无视目标30%护甲", "穿着动力装甲时, 重型枪械获得绝佳精准度, 并无视目标45%护甲"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "武器工匠", ["你可以修复任何武器到正常最大状态的130%", "你可以修复任何武器到正常最大状态的160%", "你可以修复任何武器到正常最大状态的200%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "破坏者", ["你对工坊对象的伤害+40%", "你对工坊对象的伤害+80%", "你对工坊对象的伤害+120%"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "动力装甲修补匠", ["你的动力装甲损坏速度降低20%, 修复花费也更低", "你的动力装甲损坏速度降低40%, 修复花费也更低", "你的动力装甲损坏速度降低60%, 修复花费也更低"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "拆解专家", ["拆解武器和护甲可以获得更多的部件"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "黑客", ["获得+1黑客技能, 终端锁定时间减少"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "专家级黑客", ["获得+1黑客技能, 终端锁定时间减少"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "大师级黑客", ["获得+1黑客技能, 终端锁定时间减少"], 1, SpecialEnum.INTELLIGENCE).init();
    new PerkCard(1, "化学家", ["制作药物时, 获得双倍的量"], 1, SpecialEnum.INTELLIGENCE).init();
    
    
    new PerkCard(1, "行动派男孩", ["行动点数恢复速度提高15%", "行动点数恢复速度提高30%", "行动点数恢复速度提高45%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "肾上腺素", ["30秒内每次击杀敌人获得+6% (最高36%) 的伤害加成, 每次击杀可以刷新计时", "30秒内每次击杀敌人获得+7% (最高42%) 的伤害加成, 每次击杀可以刷新计时", "30秒内每次击杀敌人获得+8% (最高48%) 的伤害加成, 每次击杀可以刷新计时" ,"30秒内每次击杀敌人获得+9% (最高54%) 的伤害加成, 每次击杀可以刷新计时", "30秒内每次击杀敌人获得+10% (最高60%) 的伤害加成, 每次击杀可以刷新计时"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "荒野求生", ["生命值低于20%时自动使用治疗针, 每20秒能触发一次", "生命值低于30%时自动使用治疗针, 每20秒能触发一次", "生命值低于40%时自动使用治疗针, 每20秒能触发一次"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "机密行动", ["你的远程潜行攻击造成2.15倍的正常伤害", "你的远程潜行攻击造成2.3倍的正常伤害", "你的远程潜行攻击造成2.5倍的正常伤害"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "决死冲锋", ["生命值低于40%时, 会消耗更多的行动点数来加快10%的冲刺速度", "生命值低于40%时, 会消耗更多的行动点数来加快20%的冲刺速度"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "狡猾", ["每次被击中可以避免10%的伤害, 但要消耗30行动点数", "每次被击中可以避免20%的伤害, 但要消耗30行动点数", "每次被击中可以避免30%的伤害, 但要消耗30行动点数"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "执法者", ["你的散弹枪有5%的概率造成失衡, 有10%的概率造成致残", "你的散弹枪有10%的概率造成失衡, 有20%的概率造成致残", "你的散弹枪有15%的概率造成失衡, 有30%的概率造成致残"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "回避话题", ["未装备动力装甲时, 每点敏捷+1点伤害和能量抗性(最高15点)", "未装备动力装甲时, 每点敏捷+2点伤害和能量抗性(最高30点)", "未装备动力装甲时, 每点敏捷+3点伤害和能量抗性(最高45点)"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "山羊腿", ["坠落伤害减少40%", "坠落伤害减少80%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "游击队员", ["现在你的自动手枪造成的伤害+10%", "现在你的自动手枪造成的伤害+15%", "现在你的自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "专家级游击队员", ["现在你的自动手枪造成的伤害+10%", "现在你的自动手枪造成的伤害+15%", "现在你的自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "大师级游击队员", ["现在你的自动手枪造成的伤害+10%", "现在你的自动手枪造成的伤害+15%", "现在你的自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "枪械武术", ["VATS切换击杀目标时,对下一个目标造成的伤害+10%", "VATS切换击杀目标时,对接下来的目标造成+10%及+20%的额外伤害", "VATS切换击杀目标时, 对接下来的目标造成+10%,+20%及+30%的额外伤害"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "持枪飞奔者", ["装备手枪时奔跑速度增加10%", "装备手枪时奔跑速度增加20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "神枪手", ["现在你的非自动手枪造成的伤害+10%", "现在你的非自动手枪造成的伤害+15%", "现在你的非自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "专家级神枪手", ["现在你的非自动手枪造成的伤害+10%", "现在你的非自动手枪造成的伤害+15%", "现在你的非自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "大师级神枪手", ["现在你的非自动手枪造成的伤害+10%", "现在你的非自动手枪造成的伤害+15%", "现在你的非自动手枪造成的伤害+20%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "保卫家园", ["你可以制作与解除标准陷阱, 也可以制作标准炮塔(需要设计图)", "你可以制作与解除高级陷阱, 也可以制作高级炮塔(需要设计图)", "你可以制作与解除专家级陷阱, 也可以制作专家级炮塔(需要设计图)"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "马拉松运动员", ["冲刺消耗的行动点数减少20%", "冲刺消耗的行动点数减少30%", "冲刺消耗的行动点数减少40%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "睡魔", ["你的消音武器能在夜晚造成额外25%的偷袭伤害", "你的消音武器能在夜晚造成额外50%的偷袭伤害"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "现代叛逆", ["获得手枪腰射精准度和+2%肢体致残几率", "获得更多的手枪腰射精准度和+3%肢体致残几率", "获得绝佳的手枪腰射精准度和+4%肢体致残几率"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "移动标靶", ["未装备动力装甲时, 冲刺时获得+15的伤害和能量抗性", "未装备动力装甲时, 冲刺时获得+30的伤害和能量抗性", "未装备动力装甲时, 冲刺时获得+45的伤害和能量抗性"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "忍者", ["使用近战武器进行潜行攻击可造成2.3倍伤害", "使用近战武器进行潜行攻击可造成2.6倍伤害", "使用近战武器进行潜行攻击可造成3倍伤害"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "轻装", ["减轻手枪25%的重量", "减轻手枪50%的重量", "减轻手枪75%的重量"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "秘密探员", ["隐形小子的持续时间变为2倍", "隐形小子的持续时间变为3倍", "隐形小子的持续时间变为4倍"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "潜行", ["潜行时被侦测到额难度增加25%", "潜行时被侦测到额难度增加50%", "潜行时被侦测到额难度增加75%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "通径徒步旅行者", ["食物及饮品的重量减轻30%", "食物及饮品的重量减轻60%", "食物及饮品的重量减轻90%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "白色骑士", ["你的护甲损坏速度降低30%, 修复花费也更低", "你的护甲损坏速度降低60%, 修复花费也更低", "你的护甲损坏速度降低90%, 修复花费也更低"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "弹药匠", ["制作弹药时产量增加40%", "制作弹药时产量增加80%"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "逃脱艺术家", ["潜行甩掉敌人, 跑步不再影响潜行状态"], 1, SpecialEnum.AGILITY).init();
    new PerkCard(1, "轻盈脚步", ["在潜行时, 不会触发地雷或地面陷阱"], 1, SpecialEnum.AGILITY).init();
    
    
    new PerkCard(1, "暴击强化", ["现在VATS暴击伤害+20%", "现在VATS暴击伤害+30%", "现在VATS暴击伤害+40%"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "一团混乱", ["5%的额外伤害意味着你的敌人有一定的几率变成血淋淋的肉泥", "10%的额外伤害意味着你的敌人有一定的几率变成血淋淋的肉泥", "15%的额外伤害意味着你的敌人有一定的几率变成血淋淋的肉泥"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "罐头小能手", ["当你搜索食物容器的时候, 有40%的几率能找到额外罐头食品", "当你搜索食物容器的时候, 有60%的几率能找到额外罐头食品", "当你搜索食物容器的时候, 有80%的几率能找到额外罐头食品"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "瓶盖收集者", ["在开启瓶盖储藏箱时, 你有几率发现更多的瓶盖", "在开启瓶盖储藏箱时, 你有较高几率发现更多的瓶盖", "在开启瓶盖储藏箱时, 你总是能发现更多的瓶盖"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "经典怪人", ["变异的负面影响减少25%", "变异的负面影响减少50%", "变异的负面影响减少75%"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "暴击领悟", ["暴击现在仅消耗85%的暴击记", "暴击现在仅消耗70%的暴击记", "暴击现在仅消耗55%的暴击记"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "幸运四叶草", ["在VATS中的每次攻击命中都有几率将你的暴击计充满", "在VATS中的每次攻击命中都有较高的几率将你的暴击计充满", "在VATS中的每次攻击命中都有极大的几率将你的暴击计充满"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "死神的冲刺", ["在VATS中的每次击杀都有15%的几率使行动点数全部恢复", "在VATS中的每次击杀都有25%的几率使行动点数全部恢复", "在VATS中的每次击杀都有35%的几率使行动点数全部恢复"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "垃圾盾", ["携带垃圾提升10点伤害和能量抗性(未装备动力装甲)", "携带垃圾提升20点伤害和能量抗性(未装备动力装甲)", "携带垃圾提升30点伤害和能量抗性(未装备动力装甲)"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "幸运签", ["攻击敌人时, 你的武器有很小几率修复自身", "攻击敌人时, 你的武器有很较大几率修复自身", "攻击敌人时, 你的武器有很大几率修复自身"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "时来运转", ["在遭受攻击时,装备中的装备有较小几率修复自身", "在遭受攻击时,装备中的装备有较大几率修复自身", "在遭受攻击时,装备中的装备有很大几率修复自身"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "生命救助者", ["当你倒下时, 会偶尔有神秘救助者出现把你复活", "当你倒下时, 会频繁的有神秘救助者出现把你复活", "当你倒下时, 会经常有神秘救助者出现把你复活"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "神秘客", ["神秘客偶尔会出现在VATS, 给予帮助", "神秘客经常会出现在VATS中", "神秘客频繁地在VATS中出现, 他甚至知道你的名字"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "神秘的肉", ["治疗针可以生成可食用肌肉组织, 高辐射值会提高概率", "治疗针可以生成更多的可食用肌肉组织, 高辐射值会提高概率", "治疗针可以生成大量可食用肌肉组织, 高辐射值会提高概率"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "一枪敌万军", ["重型枪械有4%的概率造成失衡, 有4%的概率造成致残", "重型枪械有8%的概率造成失衡, 有8%的概率造成致残", "重型枪械有12%的概率造成失衡, 有12%的概率造成致残"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "制药公司", ["有40%的几率能在搜索药物容器时找到额外的急救药物", "有60%的几率能在搜索药物容器时找到额外的急救药物", "有80%的几率能在搜索药物容器时找到额外的急救药物"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "变态杀人狂", ["在VATS中, 每造成一次击杀, 有5%的几率使你的暴击记充满", "在VATS中, 每造成一次击杀, 有10%的几率使你的暴击记充满", "在VATS中, 每造成一次击杀, 有15%的几率使你的暴击记充满"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "快手", ["有6%的几率可以在弹夹射空时立刻完成装填弹夹", "有12%的几率可以在弹夹射空时立刻完成装填弹夹", "有18%的几率可以在弹夹射空时立刻完成装填弹夹"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "跳弹", ["有6%的几率反射敌人的部分远程伤害 (非PVP)", "有12%的几率反射敌人的部分远程伤害 (非PVP)", "有18%的几率反射敌人的部分远程伤害 (非PVP)"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "搜刮者", ["有40%的几率能在搜索弹药箱时找到额外的弹药", "有60%的几率能在搜索弹药箱时找到额外的弹药", "有80%的几率能在搜索弹药箱时找到额外的弹药"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "走运", ["生命值低于30%的状态下, 有15%的几率避免受到伤害", "生命值低于30%的状态下, 有30%的几率避免受到伤害", "生命值低于30%的状态下, 有45%的几率避免受到伤害"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "超级幸运儿", ["你在制作的时候, 有10%的几率能制作出双倍成品", "你在制作的时候, 有20%的几率能制作出双倍成品", "你在制作的时候, 有30%的几率能制作出双倍成品"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "折磨者", ["你的步枪攻击有5%几率造成目标肢体残废", "你的步枪攻击有10%几率造成目标肢体残废", "你的步枪攻击有15%几率造成目标肢体残废"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "笑到最后", ["死亡时会从物品栏认出一枚解除保险的手雷"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "盐巴保鲜", ["物品栏里的食物腐化速度减缓30%", "物品栏里的食物腐化速度减缓60%", "物品栏里的食物腐化速度减缓90%"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "保姆", ["在复活其他玩家时, 有50%的几率不消耗医疗针"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "博物馆长", ["娃娃和杂志的增益持续时间翻倍"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "土拨鼠", ["砍伐树木可获得双倍木材"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "追风者", ["在下雨或辐射风暴期间获得生命恢复", "在下雨或辐射风暴期间获得高速生命恢复"], 1, SpecialEnum.LUCK).init();
    new PerkCard(1, "顽固基因", ["减少从辐射中变异的几率, 同时也减少消辐宁治疗变异的概率", "不会从辐射中变异, 消辐宁也无法治愈变异"], 1, SpecialEnum.LUCK).init();
}

/*
    show the perk cards in the card selection area.
*/
function showCards(special) {
    let selectionElement = document.getElementById("card-selections");
    //remove all children
    while(selectionElement.firstChild) {
        selectionElement.removeChild(selectionElement.firstChild);
    }
    
    //cards for a selected special stat
    let specialCards = cards[special-1];
    
    for(let i = 0; i < specialCards.length; i++) {
        //create a card element
        let perkCard = specialCards[i];
        if(!perkCard.isSelected) {
            let element = perkCard.createElement();
            selectionElement.appendChild(element);
        }
    }
}

function handleVariable() {
    let url = new URL(window.location.href);
    let parameter = url.searchParams.get("p");
    console.log(parameter);
}