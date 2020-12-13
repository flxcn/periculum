/*===============================
              RISK             
===============================*/

//SVG map adapted from https://commons.wikimedia.org/wiki/File:Risk_board.svg
//Built using svg, sass and plain javascript

/* Instructions

Aim: To control all the areas on the map
You control the dark blue areas

Every turn you get additional troops to place on the map. 
The number of troops is increased by:
  * Owning more areas
  * Increases slightly after each turn
  * Controlling all areas on a continent
To place a troop click on an area you control when it's the fortify stage 
  
Once your reserve is 0 the stage changes to the battle stage.

To attack an opponent select an area you control to attack from and a neighbouring opponent to attack
You must have a least one troop to attack an opponent.
If you win the opponents territory will become yours and remaining troops will split between the two areas
If you lose the troops in your area will become 0

Click 'End Turn' to continue the game and pass control to the AI

*/

/* Data */

const continents = [
    // {
    // areas: ["britannia"],
    // name: "britannia",
    // bonus: 0
    // },
    {
        areas: ["lugdunensis", "belgica", "germania_inferior", "germania_superior"],
        name: "galliarum",
        bonus: 2
    },
    {
        areas: ["aquitania", "narbonensis"],
        name: "viennensis",
        bonus: 1
    },
    {
        areas: ["tarraconensis", "lusitania", "baetica", "mauretania_tingitana"],
        name: "hispaniarum",
        bonus: 2
    },
    {
        areas: ["mauretania_caesariensis", "africa_proconsularis"],
        name: "africae",
        bonus: 1
    },
    {
        areas: ["cyrenaica", "aegyptus", "arabia_petraea", "iudaea", "syria", "mesopotamia", "assyria", "cilicia"],
        name: "orientis",
        bonus: 7
    },
    {
        areas: ["bithynia_et_pontus", "cappadocia", "armenia"],
        name: "pontica",
        bonus: 2
    },
    {
        areas: ["asia", "lycia_et_pamphylia", "galatia"],
        name: "asiana",
        bonus: 2
    },
    {
        areas: ["moesia_inferior", "thracia"],
        name: "thraciae",
        bonus: 2
    },
    {
        areas: ["dacia", "moesia_superior", "macedonia","epirus","achaia"],
        name: "moesiarum",
        bonus: 4
    },
    {
        areas: ["noricum", "pannonia_superior", "pannonia_inferior","dalmatia"],
        name: "pannoniarum",
        bonus: 2
    },
    {
        areas: ["raetia", "italia"],
        name: "italia",
        bonus: 1
    }

];


// NOTE: need to edit. set owner to tetrarchy 
const countries = [
    {name: "iudaea", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["arabia_petraea", "syria"]},
    {name: "armenia", continent: "pontica", owner: "none", color:"white", "army": 0, neighbours: ["mesopotamia", "assyria", "cappadocia"]},
    {name: "assyria", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["mesopotamia", "armenia"]},
    {name: "mesopotamia", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["syria", "cappadocia", "armenia", "assyria"]},
    
    {name: "syria", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["cilicia", "cappadocia", "armenia", "mesopotamia", "iudea", "arabia petraea"],},
    {name: "arabia_petraea", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["aegyptus", "iudea", "syria"]},
    
    {name: "aegyptus", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["cyrenaica", "arabia_petraea"]},
    {name: "cyrenaica", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["africa_proconsularis", "aegyptus"]},
    
    {name: "cappadocia", continent: "pontica", owner: "none", color:"white", "army": 0, neighbours: ["bithynia_et_pontus", "galatia", "cilicia", "syria","mesopotamia","armenia"]},
    {name: "cilicia", continent: "orientis", owner: "none", color:"white", "army": 0, neighbours: ["lycia_et_pamphylia", "galatia", "cappadocia", "syria"]},
    {name: "galatia", continent: "asiana", owner: "none", color:"white", "army": 0, neighbours: ["lycia_et_pamphylia", "asia", "bithynia_et_pontus", "cappadocia", "cilicia"]},
    {name: "lycia_et_pamphylia", continent: "asiana", owner: "none", color:"white", "army": 0, neighbours: ["asia", "galatia", "cilicia"]},
    {name: "asia", continent: "asiana", owner: "none", color:"white", "army": 0, neighbours: ["achaia", "macedonia", "thracia","bithynia_et_pontus","galatia","lycia_et_pamphylia"]},
    
    {name: "africa_proconsularis", continent: "africae", owner: "none", color:"white", "army": 0, neighbours: ["mauretania_caesariensis", "italia","aegyptus"]},
    {name: "mauretania_caesariensis", continent: "africae", owner: "none", color:"white", "army": 0, neighbours: ["mauretania_tingitana", "africa_proconsularis"]},
    
    {name: "achaia", continent: "moesiarum", owner: "none", color:"white", "army": 0, neighbours: ["epirus", "macedonia","asia"]},
    {name: "moesia_superior", continent: "moesiarum", owner: "none", color:"white", "army": 0, neighbours: ["dalmatia", "pannonia_inferior", "dacia", "moesia_inferior","thracia","macedonia"]},
    {name: "pannonia_inferior", continent: "pannoniarum", owner: "none", color:"white", "army": 0, neighbours: ["dalmatia", "pannonia_superior", "dacia", "moesia_superior"]},
    

    // to-do
    {name: "macedonia", continent: "moesiarum", owner: "none", color:"white", "army": 0, neighbours: ["epirus", "dalmatia", "moesia_superior", "thracia", "asia", "achaia"]},
    {name: "epirus", continent: "moesiarum", owner: "none", color:"white", "army": 0, neighbours: ["italia", "macedonia", "achaia"]},
    {name: "bithynia_et_pontus", continent: "pontica", owner: "none", color:"white", "army": 0, neighbours: ["thracia", "asia", "galatia", "cappadocia"]},
    {name: "thracia", continent: "thraciae", owner: "none", color:"white", "army": 0, neighbours: ["moesia_superior", "dacia", "moesia_inferior","bithynia_et_pontus","asia","macedonia"]},
    {name: "dacia", continent: "moesiarum", owner: "none", color:"white", "army": 0, neighbours: ["pannonia_inferior", "moesia_superior", "moesia_inferior"]},
    {name: "moesia_inferior", continent: "thraciae", owner: "none", color:"white", "army": 0, neighbours: ["dacia", "moesia_superior", "thracia"]},
    {name: "pannonia_superior", continent: "pannoniarum", owner: "none", color:"white", "army": 0, neighbours: ["noricum", "italia","dalmatia","pannonia_inferior"]},
    
    {name: "dalmatia", continent: "pannoniarum", owner: "none", color:"white", "army": 0, neighbours: ["italia", "pannonia_superior", "pannonia_inferior", "moesia_superior", "macedonia"]},
    {name: "noricum", continent: "pannoniarum", owner: "none", color:"white", "army": 0, neighbours: ["raetia", "italia", "pannonia_superior"]},
    
    {name: "ratia", continent: "italiae", owner: "none", color:"white", "army": 0, neighbours: ["germania_superior", "narbonensis", "italia", "noricum"]},
    {name: "italia", continent: "italiae", owner: "none", color:"white", "army": 0, neighbours: ["narbonensis", "raetia", "noricum", "pannonia_superior", "dalmatia", "africa_proconsularis", "epirus"]},
    
    {name: "germania_superior", continent: "galliarum", owner: "none", color:"white", "army": 0, neighbours: ["germania_inferior", "belgica", "lugdunensis", "narbonensis", "italia", "noricum"]},
    {name: "germania_inferior", continent: "galliarum", owner: "none", color:"white", "army": 0, neighbours: ["belgica", "germania_superior"]},
    {name: "belgica", continent: "galliarum", owner: "none", color:"white", "army": 0, neighbours: ["germania_inferior", "germania_superior", "lugdunensis"]},
    {name: "lugdunensis", continent: "galliarum", owner: "none", color:"white", "army": 0, neighbours: ["aquitania", "narbonensis", "germania_superior", "belgica"]},
    
    {name: "narbonensis", continent: "viennensis", owner: "none", color:"white", "army": 0, neighbours: ["tarraconensis", "aquitania", "lugdunensis", "germania_superior", "raetia", "italia"]},
    {name: "aquitania", continent: "viennensis", owner: "none", color:"white", "army": 0, neighbours: ["tarraconensis", "narbonensis", "lugdunensis"]},
    
    {name: "tarraconensis", continent: "hispaniarum", owner: "none", color:"white", "army": 0, neighbours: ["aquitania", "narbonensis", "lusitania", "baetica"]},
    {name: "lusitania", continent: "hispaniarum", owner: "none", color:"white", "army": 0, neighbours: ["tarraconensis", "baetica"]},
    {name: "baetica", continent: "hispaniarum", owner: "none", color:"white", "army": 0, neighbours: ["lusitania", "tarraconensis", "mauretania_tingitana"]},
    {name: "mauretania_tingitana", continent: "hispaniarum", owner: "none", color:"white", "army": 0, neighbours: ["baetica"]},

    // {name: "corsica", continent: "North America", owner: "none", color:"white", "army": 0, neighbours: ["alaska", "western_us", "ontario", "northwest_territory"]},
    // {name: "sardinia", continent: "North America", owner: "none", color:"white", "army": 0, neighbours: ["greenland", "quebec", "alberta", "western_us", "eastern_us", "northwest_territory"]},
    // {name: "sicilia", continent: "North America", owner: "none", color:"white", "army": 0, neighbours: ["greenland", "eastern_us", "ontario"]},
    {name: "britannia", continent: "britanniarum", owner: "none", color:"white", "army": 0, neighbours: ["lugdunensis", "belgica"]}
    // {name: "creta", continent: "North America", owner: "none", color:"white", "army": 0, neighbours: ["greenland", "quebec", "alberta", "western_us", "eastern_us", "northwest_territory"]},
    // {name: "cyprus", continent: "North America", owner: "none", color:"white", "army": 0, neighbours: ["greenland", "quebec", "alberta", "western_us", "eastern_us", "northwest_territory"]},
];

const players = [
    {
     "name": "Constantine",
     "country": "Britannia",
     "color": "#030f63",
     "army": 10,
     "reserve": 10,
     "areas": [],
     "bonus": 2,
     "alive": true
    },
    {
     "name": "Severus",
     "country": "Italia",
     "color": "#d6040e",
     "army": 20,
     "reserve": 20,
     "areas": [],
     "bonus": 2,
     "alive": true
    },
    {
     "name": "Galerius",
     "country": "Asia",
     "color": "#d86b04",
     "army": 20,
     "reserve": 20,
     "areas": [],
     "bonus": 2,
     "alive": true
    },
    {"name": "Maximinus Daia",
     "country": "Orientis",
     "color": "#0eb7ae",
     "army": 20,
     "reserve": 20,
     "areas": [],
     "bonus": 2,
     "alive": true 
    },
    // Usurpers
    {"name": "Allectus",
     "country": "Gallia",
     "color": "#104704",
     "army": 20,
     "reserve": 20,
     "areas": [],
     "bonus": 2,
     "alive": true
    },
    {"name": "Domitianus",
     "country": "Aegyptus",
     "color": "#c6c617",
     "army": 20,
     "reserve": 20,
     "areas": [],
     "bonus": 2,
     "alive": true
    },
];

//Helper Functions

Array.prototype.containsArray = function (array) {    
    if( arguments[1] ) {
        var index = arguments[1], last = arguments[2];
    } else {
        var index = 0, last = 0; this.sort(); array.sort();
    };
    return index == array.length
        || ( last = this.indexOf( array[index], last ) ) > -1
        && this.containsArray( array, ++index, ++last );           
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//DOM Elements

const infoName = Array.from(document.getElementsByClassName('country'));
const infoLeader = Array.from(document.getElementsByClassName('leader'));
const infoIncome = Array.from(document.getElementsByClassName('income'));
const areas = Array.from(document.getElementsByClassName('area'));
const bar = Array.from(document.getElementsByClassName('bar'));

const map = document.querySelector('svg');
//Modals
const modal = document.querySelector('#start-modal');
const reserveDisplay = document.querySelector('#reserve');
const chosenLeader = document.querySelector('#chosen-leader');
const chosenCountry = document.querySelector('#chosen-country');
const submitName = document.querySelector('#submit-name');
const bonusModal = document.querySelector('.bonus-modal');
const bonusModalAmount = document.querySelector('.bonus-modal-amount');
const bonusModalText = document.querySelector('.bonus-modal-text');
const bonusModalPlayer = document.querySelector('.bonus-modal-player');
const winModal = document.querySelector('#win-modal');
const winMessage = document.querySelector('.win-message');
const playAgain = document.querySelector('#play-again');
//Info Panels
const playerName = document.querySelector('.player-name');
const playerCountry = document.querySelector('.player-country');
const restart = document.querySelector('#restart');
const playerPanel = document.querySelector('.player-panel');
const infoPanel = document.querySelector('.info');
const turnInfo = document.querySelector('.turn-info');
const turnInfoMessage = document.querySelector('.turn-info-message');
const end = document.querySelector('#end');


//Create Game Object

let Gamestate = {};

Gamestate.countries = JSON.parse(JSON.stringify(countries)); //Array of Countries on Map
Gamestate.players = JSON.parse(JSON.stringify(players)) //Array of all players
Gamestate.player = JSON.parse(JSON.stringify(players))[0] //Human Player
Gamestate.stage = "Fortify"; // Fortify, Battle or AI Turn
Gamestate.turn = 1; 
Gamestate.aiTurn = false;
Gamestate.timeInterval = 1000; //Time between AI Turns
Gamestate.gameOver = false;
Gamestate.prevCountry = null; //Store previously selected country
Gamestate.prevTarget = null; //Store previously selected target;

//Game Setup

Gamestate.init = function(){
    modal.style.display = "block";
    winModal.style.display = "none";
    submitName.addEventListener('click', this.start.bind(this));
    restart.addEventListener('click', this.restart.bind(this));
    map.addEventListener('mousedown', this.handleClick.bind(this)); 
    end.addEventListener('click', this.handleEndTurn.bind(this));
    playAgain.addEventListener('click', this.restart.bind(this));
}

Gamestate.start = function(){
    //Reset Variables on Start/Restart
    end.style.pointerEvents = "auto";
    map.style.pointerEvents = "auto";
    modal.style.display = "none";
    playerPanel.style.display = "flex";
    infoPanel.style.display = "block";
    this.aiTurn = false;
    this.timeInterval = 1000;
    this.gameOver = false;
    this.prevCountry = null;
    this.prevTarget = null;
    this.turn = 1;
    this.stage = "Fortify";
    turnInfoMessage.textContent = "Click on your own areas to place reserve armies";
    this.countries = JSON.parse(JSON.stringify(countries));
    this.players = JSON.parse(JSON.stringify(players));
    this.player = this.players[0];
    this.players[0].name = chosenLeader.value;
    this.players[0].country = chosenCountry.value;
    reserveDisplay.innerHTML = 12;
    playerName.textContent = chosenLeader.value;
    playerCountry.textContent = chosenCountry.value;
    
    if(this.prevTarget){
        this.prevTarget.classList.remove('flash');
    }
    
    //Add Players details to Info Panel
    for(let j = 0; j < this.players.length; j++){ 
        infoName[j].innerHTML = this.players[j].country;
        infoLeader[j].innerHTML = this.players[j].name;
        infoName[j].parentElement.classList.remove('defeated');
        bar[j].style.background = this.players[j].color;
    }
    
    //Add Initial Armies to Game
    shuffle(areas).forEach((area, i) => {
    this.countries.forEach(country => {     
        if (country.name === area.id) {
            //Using module as i = 42 areas 
            country.army = this.placeInitialArmy(i);
            country.owner = this.players[i % 6].name;
            country.color = this.players[i % 6].color;
            this.players[i % 6].areas.push(area.id)
            setTimeout(() => {     
                area.style.fill = country.color;
                area.nextElementSibling.textContent = country.army;      
            }, 25 * i)
        }
    })
  })
  this.player.army += 10;
  this.player.reserve += 10;
  this.updateInfo();
}

//Handle Initial Army Placement at Random
Gamestate.placeInitialArmy = function(i){
    let reserve = this.players[i % 6].reserve;
    if(i > 35){  //dump remaining army on last area
        this.players[i % 6].reserve = this.players[i % 6].bonus;
        this.players[i % 6].army += this.players[i % 6].reserve;
        return reserve;       
    }
    if(this.players[i % 6].reserve > 2){
        let rand = Math.floor((Math.random()) * 4);
        this.players[i % 6].reserve -= rand;      
        return rand
    }
    else {
        return 0;
    }
}

//Win/Lose Handlers

Gamestate.win = function(player){
    winMessage.textContent = player.name;
    winMessage.style.color = player.color;
    winModal.style.display = "block"; 
}

Gamestate.restart = function(){
    modal.style.display = "block";
    winModal.style.display = "none";
}

//Update Display and Strength Bar
Gamestate.updateInfo = function(){
    turnInfo.textContent = this.stage;
    let totalArmy = 0;
    this.players.forEach(player => {
        totalArmy += player.army
    });
    this.players.forEach((player, i) => {
        infoIncome[i].innerHTML = player.bonus;
        bar[i].style.width = (player.army / totalArmy) * 600 + 'px';
    })
    
}

/*Gameplay*/


Gamestate.handleEndTurn = function(){
    if(this.aiTurn){
        return;
    }
    this.aiTurn = true;
    end.style.pointerEvents = "none";
    map.style.pointerEvents = "none";
    this.aiMove();
}

//Bonus Handlers

Gamestate.unitBonus = function(player, i){
    player.bonus = 0;
    player.bonus += Math.ceil(player.areas.length / 3);
    player.bonus += this.continentBonus(player);
    player.bonus = Math.ceil(player.bonus * (this.turn / 5)); 
    if(player.bonus < 2){ 
        player.bonus = 2;
    }
    infoIncome[i].innerHTML = player.bonus;
    return player.bonus
}

Gamestate.continentBonus = function(player){
    let bonus = 0;
    continents.forEach( continent => {
        if(player.areas.containsArray(continent.areas)){
            bonus += continent.bonus;
        }
    })   
    return bonus;
}

//Player

Gamestate.handleClick = function(e){
    if(this.stage === "Fortify"){
        this.addArmy(e);
    }
    else if(this.stage === "Battle"){
        this.attack(e);
    }  
}

//Fortify area on player click
Gamestate.addArmy = function(e){ 
    this.countries.forEach(country => {
        //Check if Target is in country array and player has enough in reserve and player owns territory
        if(e.target.id === country.name && this.player.reserve > 0 && country.owner === this.player.name){
            if(e.shiftKey){
                country.army += this.player.reserve;     
                this.player.reserve = 0;
            }
            else{
                country.army += 1;
                this.player.reserve -= 1;               
            }         
            reserveDisplay.innerHTML = this.player.reserve;
            e.target.nextElementSibling.textContent = country.army;
            //Once reserve is empty, battle stage can start
            if(this.player.reserve === 0){
                this.stage = "Battle";
                turnInfo.textContent = this.stage;
                turnInfoMessage.textContent = "Choose a province to attack from then a target";
            }
        }
    })   
}

//Attack handler finds Attacking and defending countries and passes to the battle function
Gamestate.attack = function(e){
    //Remove flash animation from previous area 
    if(this.prevTarget){
        this.prevTarget.classList.remove('flash');
    }
    this.countries.forEach(country => {
        if(e.target.id === country.name){
            e.target.classList.add('flash');
            this.prevTarget = e.target;
            if(this.prevCountry){
                if(this.prevCountry.name !== country.name && this.prevCountry.owner !== country.owner && this.prevCountry.owner === this.player.name){
                    this.prevCountry.neighbours.forEach(neighbour => {               
                      if(neighbour === country.name && neighbour.owner !== country.name && this.prevCountry.army > 0){       
                        return this.battle(this.prevCountry, country, this.player, 0);            
                      }                
                     })
                 }      
            }
            this.prevCountry = country;
        }
    });   
}

//Computer

//Handles AI Moves
Gamestate.aiMove = function(){
    if(this.gameOver){
        return;
    }
    if(this.prevTarget){
        this.prevTarget.classList.remove('flash');
    }
    this.stage = "AI Turn";
    turnInfoMessage.textContent = "";
    
    for(let i = 1; i <= this.players.length; i++){  
        setTimeout(() => { 
            //Handle after last player finished turn
            if(i === this.players.length){ 
                //Handle if human player defeated
                if(this.player.areas.length === 0){
                    this.timeInterval = 10;
                    this.player.alive = false;
                    return this.aiMove(); 
                }
                this.turn += 1;
                this.aiTurn = false;
                this.stage = "Fortify";
                turnInfoMessage.textContent = "Click on your own areas to place reserve armies";
                let bonus = this.unitBonus(this.player, 0);
                this.player.reserve += bonus;
                this.player.army += bonus;
                end.style.pointerEvents = "auto";
                map.style.pointerEvents = "auto";
                infoName[i-1].parentElement.classList.remove('highlight');
                infoName[0].parentElement.classList.add('highlight')
                reserveDisplay.innerHTML = this.player.reserve;
                return this.updateInfo();
            }
            
            //Handle turn
            infoName[i-1].parentElement.classList.remove('highlight'); 
            if(this.players[i].alive){               
                infoName[i].parentElement.classList.add('highlight')
                this.players[i].reserve = this.unitBonus(this.players[i], i);
                this.players[i].army += this.players[i].reserve;
                
                //Fortify
                let areaToFortify = ["",  0];            
                this.players[i].areas.forEach(area => {
                    this.countries.forEach(country => {
                        if(country.name === area && this.players[i].reserve > 0){
                            country.neighbours.forEach(neighbour => {
                                this.countries.forEach(c => {
                                    if(c.name === neighbour && c.owner !== this.players[i].name){
                                        let continent;
                                        continents.forEach(x => {
                                            if(x.name === country.continent){
                                                continent = x;                                               
                                            }
                                        });
                                        let count = 0;
                                        continent.areas.forEach(x => {
                                            this.players[i].areas.forEach(y => {
                                                if(y === x){                                             
                                                    count++;
                                                }
                                            })
                                        });                                       
                                        let ratio = count / continent.areas.length;
                                        if (ratio >= areaToFortify[1]){
                                            areaToFortify = [country, ratio]
                                        }                            
                                    }
                                })
                            })
                        }
                    })
                })
                           
                areaToFortify[0].army += this.players[i].reserve;
                this.players[i].reserve = 0;
                let areaOnMap = document.getElementById(`${areaToFortify[0].name}`);
                areaOnMap.nextElementSibling.textContent = areaToFortify[0].army;
                                
                //Attack
                
                this.players[i].areas.forEach(area => {
                    this.countries.forEach(country => {
                        if(country.name === area && country.army > 1){
                            this.aiAttack(country, i);
                        }
                    })
                })
                this.updateInfo();
            } 
        }, this.timeInterval * i) 
    }
}

//Find Attacking and defending countries on AI Attack
Gamestate.aiAttack = function(country, i){
    //Add possible targets to array
    let possibleTargets = []; 
    country.neighbours.forEach(neighbour => {    
        this.countries.forEach(opponent => {    
            if(neighbour === opponent.name && opponent.army + 1 < country.army && country.owner !== opponent.owner ){
                possibleTargets.push(opponent);          
            }             
        })
    })
    
    //Check which is best target by checking if taking area will control continent
    let target = [possibleTargets[0], 0];
    let continent;
    possibleTargets.forEach(poss => {
        continents.forEach(x => {
            if(x.name === poss.continent){
                continent = x;
            }
        })
        let count = 0;
        continent.areas.forEach(x => {
            this.players[i].areas.forEach(y => {
                if(y === x){                                             
                    count++;
                }
            })
        });
        let ratio = count / continent.areas.length;
        if(ratio >= target[1]){                 
            target = [poss, ratio]           
        }            
    })  
    if(!target[0]){
        return;
    }    
    this.battle(country, target[0], this.players[i], i);
}

//Battle function for Player and AI

Gamestate.battle = function(country, opponent, player, i){
    
    let defender = document.getElementById(`${opponent.name}`)
    let attacker = document.getElementById(`${country.name}`)
    let opp;
    this.players.forEach(p => {
        if(p.name === opponent.owner){
            opp = p;
        }
    })
    
    //Battle Logic
    while(opponent.army >= 0){
        if(country.army === 0){
            attacker.nextElementSibling.textContent = 0;
            defender.nextElementSibling.textContent = opponent.army;
            return;
        }
        if(Math.random() > Math.random()){
            country.army -= 1; 
        }
        else{
            opponent.army -= 1;
        }
    }
    
    //Handle if Attacker Wins
    if(opponent.army <= 0 ){
        //Remove area from defenders areas array
        this.players.forEach(player => {
            if(player.name === opponent.owner){
                let index = player.areas.indexOf(opponent.name);
                if (index > -1) {
                    player.areas.splice(index, 1);
                }
            }
        });
        
        //Swap defender area to attacker and distribute army evenly between areas
        opponent.owner = player.name;
        opponent.color = player.color;
        player.areas.push(opponent.name);
        defender.style.fill = opponent.color;
        defender.nextElementSibling.textContent = Math.floor(country.army / 2);
        opponent.army = Math.floor(country.army / 2);
        attacker.nextElementSibling.textContent = Math.ceil(country.army / 2);
        country.army = Math.ceil(country.army / 2);
        
        //If Defender has no areas left they are eliminated
        if(opp.areas.length === 0){
            opp.alive = false;
            let index = this.players.indexOf(opp)
            infoName[index].parentElement.classList.add('defeated');
        }
    }
        
    //Calcualting total army for each player
    player.army = 0;
    opp.army = 0;
    this.countries.forEach(c => {
        player.areas.forEach(area => {
            if(area === c.name){
                player.army += c.army
            }
         })
        opp.areas.forEach(area => {
            if(area === c.name){
                opp.army += c.army
            }
        })
    })
    
    //Display Bonus modal if player controls continent
    if(this.player.alive){
        continents.forEach(continent => {
            if(player.areas.containsArray(continent.areas)){   
                let matchedCountry = continent.areas.some(a => {
                   return a === opponent.name;
                });
                if(matchedCountry){
                    bonusModal.style.display = "block";
                    bonusModalPlayer.textContent = player.name + " controls"
                    bonusModalText.textContent = "Diocesis " + continent.name;
                    bonusModalText.style.color = player.color;
                    bonusModalAmount.textContent = continent.bonus;
                     setTimeout(() => {
                         bonusModal.style.display = "none";
                     }, 2000);
                }
            }
        })  
    }
    
    //Win Condition
    if(player.areas.length === 42){
        this.gameOver = true;
        this.win(player);
    }    
}

//Initialize Game
Gamestate.init();