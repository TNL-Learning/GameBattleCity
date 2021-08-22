const QUANTITY_CELL_COL = 15;
const QUANTITY_CELL_ROW = 15;

const FPS = 50;

//Size:
const CELL_SIZE = 40;
const HALF_CELL_SIZE = 20;
const BLOCK_SIZE = CELL_SIZE * 2;       //4x20
const VIEW_WIDTH = QUANTITY_CELL_COL * BLOCK_SIZE;
const VIEW_HEIGHT = QUANTITY_CELL_ROW * BLOCK_SIZE;
const BULLET_HEIGHT = 15;
const BULLET_WIDTH = 10;

//list playing modes:
const PLAYING_MODE = ["PvsB", "PPvsB", "PPvsP", "PPvsPP"];

//brick ID: 
const HOME_ID = -2;
const WATER_ID = -1;
const EMPTY_ID = 0;
const FOREST_ID = 1;
const BRICK1_ID = 2;
const BRICK2_ID = 3;
const CONCRETE_ID = 4;

//Moving Direction:
const STAND = -1;
const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

//speed:
const TANK_SPEED = 5;
const BULLET_SPEED = 8;
const TANK_TIME_RELOAD = 20;

//Map control:
let mapControl = [
    ["a", "w", "d", "s", " "],
    ["j", "i", "l", "k", "Enter"],
    ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "End"],
    ["4", "8", "6", "2", "+"],
];
let mapKey = [
    [" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"],
    ["Space", "&larr;", "&uarr;", "&rarr;", "&darr;"]
];

//Bullet status:
const FLYING = 0;
const CRASHING = 1;
const DESTROYED = 2;
//Tank and Terrain status:
const REVIVAL = -1;
const EXISTING = 0;
const TAKEN = 3;
//game"
const PLAYING = 4;
const PAUSE = 5;
const STOPGAME = 6;

//Data name
const CONTROL = "BattleCity_Control";
const PLAYER = "BattleCity_NumberPlayer";
const MAPID = "BattleCity_MapID";
const MAPDATA = "BattleCity_MapData";
const GAMEDATA = "BattleCity_GameData";
//GameData = [mode-index, map-id];
//const STORAGEDATA = [CONTROL, PLAYER, MAPID, MAPDATA];

function saveData(key, arrData) {
    let strData = JSON.stringify(arrData);
    window.localStorage.setItem(key, strData);
}

function loadData(key) {
    if (localStorage.hasOwnProperty(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
    return [];
}
function findKey(key, reverse) {
    if (key.length <= 1 && key != " "){
        return key;
    }
    let source = 0;
    let target = 1;
    if (reverse) {
        target = 0;
        source = 1;
    }
    for (let i = 0; i< mapKey[0].length; i++){
        if (mapKey[source][i] == key){
            return mapKey[target][i];
        }
    }
    return key;
}

