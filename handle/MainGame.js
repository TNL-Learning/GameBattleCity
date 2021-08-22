class Battle {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.redraw = parseInt(1000 / FPS);
        this.PlayerTeams = [];
        this.Bullets = [];
        this.Actions = [];
        this.status = PLAYING;
        this.Result = "Undefine";
        this.GiftStorage  = new GiftStorage();
        this.initialize();
    }


    initialize() {
       // console.log("~~~~~~~~~~~~~~~~display status:"+document.getElementById("game-over").style.display+"~~~~~~~~~~~~~~~~");
        //document.getElementById("game-over").style.visibility = "hidden";
        //document.getElementById("game-over").style.display = "none";
        //create canvas:
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        let view = document.getElementById("view-space");
        view.appendChild(this.canvas);
        //document.body.appendChild(this.canvas);
        this.canvas.width = VIEW_WIDTH;
        this.canvas.height = VIEW_HEIGHT;
        this.canvas.style.backgroundColor = "black";

        //Create items:
        let gameData = loadData(GAMEDATA);  //[mode, id]
        if (gameData.length == 0) {
            gameData = [0, 0];
        }

        let map = new MapGame(gameData[0], gameData[1]);
        map.createMap();
        this.BlocksTerrain = map.blocks;
        this.PlayerTeams = map.PlayerTeams;
        this.RobotTeam = map.RobotTeam;
        this.Headquarters = map.listHeadquarter;


        let mapControlKey = loadData(CONTROL);
        if (mapControlKey.length == 0) {
            mapControlKey = mapControl;
        }

        this.validKeys = [];
        for (let i = 0; i < this.PlayerTeams.length; i++) {
            for (let j = 0; j < this.PlayerTeams[i].members.length; j++) {
                let id = this.PlayerTeams[i].members[j].id;
                this.PlayerTeams[i].members[j].setControlKey(mapControlKey[id]);
                for (let k = 0; k < mapControlKey[id].length; k++) {
                    this.validKeys.push(mapControl[id][k]);
                }
            }
        }

       this.runing();
    }

    initializeMap() {
        
        let maps = loadData(MAPDATA);
        if (maps) {
            let map = maps[0];
            this.BlocksTerrain = map.blocks;
            this.PlayerTeams = map.PlayerTeams;
            this.RobotTeam = map.RobotTeam;
            this.Headquarters = map.listHeadquarter;
        }
        else {
            let map = new MapGame();
            map.createMap();
            this.BlocksTerrain = map.blocks;
            this.PlayerTeams = map.PlayerTeams;
            this.RobotTeam = map.RobotTeam;
            this.Headquarters = map.listHeadquarter;
        }
    }


    runing() {
        if (this.isOver()) {
            this.status = STOPGAME;
        }
        this.update();
        this.renderFrame();
        setTimeout(() => this.runing(), this.redraw);
    }

    isOver() {
        for (let i = 0; i < this.PlayerTeams.length; i++) {
            if (this.PlayerTeams[i].isLoseThisBattle()) {
                this.Result = "Lose";
                return true;
            }
        }
        for (let i = 0; i < this.RobotTeam.length; i++) {
            if (this.RobotTeam[i].isLoseThisBattle()) {
                this.Result = "Win";
                return true;
            }
        }
        for (let i = 0; i < this.Headquarters.length; i++) {
            if (this.Headquarters[i].status == DESTROYED) {
                this.Result = "Lose";
                return true;
            }
        }
    }


    update() {
        if (this.status != PLAYING) {
            return;
        }
        this.updateControlAction();
        this.updateBullet();
        this.updateBlockTerrains();
        this.updateRobots();
        this.updateInfor();
        this.GiftStorage.update(this.PlayerTeams, this.RobotTeam);
    }

    updateInfor() {
        let str = "";
        for (let i = 0; i < this.RobotTeam.length; i++) {
            str += this.RobotTeam[i].updateInfor();
        }
        for (let i = this.PlayerTeams.length - 1; i >= 0; i--) {
            str += this.PlayerTeams[i].updateInfor();
        }
        document.getElementById("Infor").innerHTML = str;
    }

    updateControlAction() {
        if (this.Actions.length == 0) {
            return;
        }
        for (let i = 0; i < this.Actions.length; i++) {
            for (let j = 0; j < this.PlayerTeams.length; j++) {
                if (this.PlayerTeams[j].updateAction(this.Actions[i], this.BlocksTerrain, this.Bullets)) {
                    break;
                }
            }
        }
    }
    updateBullet() {
        let needToCheck = true;
        for (let i = 0; i < this.Bullets.length; i++) {
            if (this.Bullets[i].status == DESTROYED) {
                this.Bullets.splice(i, 1);
                i--;
                continue;
            }
            needToCheck = true;
            //check hit terrain:
            for (let j = 0; j < this.BlocksTerrain.length; j++) {
                if (this.BlocksTerrain[j].isHitBullet(this.Bullets[i])) {
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }
            //check hit other bullets:
            for (let j = i + 1; j < this.Bullets.length; j++) {
                if (this.Bullets[i].isHitBullet(this.Bullets[j])) {
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }
            //check hit Enemy:
            for (let j = 0; j < this.PlayerTeams.length; j++) {
                if (this.PlayerTeams[j].isHitBullet(this.Bullets[i])) {
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }
            for (let j = 0; j < this.RobotTeam.length; j++) {
                if (this.RobotTeam[j].isHitBullet(this.Bullets[i])) {
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }

            for (let j = 0; j < this.Headquarters.length; j++) {
                if (this.Bullets[i].isHitHeadQuarter(this.Headquarters[j])) {
                    this.Headquarters[j].changeStatus();
                    this.status = STOPGAME;
                    return;
                }
            }
        }
    }
    updateRobots() {
        for (let i = 0; i < this.RobotTeam.length; i++) {
            this.RobotTeam[i].autoControl(this.Bullets, this.BlocksTerrain, this.PlayerTeams);
        }
    }

    updateBlockTerrains() {
        for (let i = 0; i < this.BlocksTerrain.length; i++) {
            this.BlocksTerrain[i].update();
            if (this.BlocksTerrain[i].status == DESTROYED) {
                this.BlocksTerrain.splice(i, 1);
                i--;
            }
        }
    }

    renderFrame() {
        if (this.status == PAUSE) {
            return;
        }
        if (this.status == STOPGAME) {
            this. renderEndGame();
        }
        this.context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

        for (let i = 0; i < this.BlocksTerrain.length; i++) {
            if (this.BlocksTerrain[i].type == WATER_ID) {
                this.BlocksTerrain[i].render(this.context);
            }
        }
        for (let i = 0; i < this.RobotTeam.length; i++) {
            this.RobotTeam[i].render(this.context);
        }
        for (let i = 0; i < this.PlayerTeams.length; i++) {
            this.PlayerTeams[i].render(this.context);
        }
        for (let i = 0; i < this.BlocksTerrain.length; i++) {
            if (this.BlocksTerrain[i].type != WATER_ID) {
                this.BlocksTerrain[i].render(this.context);
            }
        }
        for (let i = 0; i < this.Headquarters.length; i++) {
            this.Headquarters[i].render(this.context);
        }
        for (let i = 0; i < this.Bullets.length; i++) {
            this.Bullets[i].render(this.context);
        }
        for (let i = 0; i < this.GiftStorage.store.length; i++) {
            this.GiftStorage.store[i].render(this.context);
        }
        //this.GiftStorage.render(this.context);
    }
    renderEndGame(){
        // if (this.Result == "Lose" && this.time == 0){
        //     //document.getElementById("game-over").style.visibility = " ";
        //     let image = new Image();
        //     image.src = "image/Intro/GameOver2.gif";
        //     image.onload =  function() {this.context.drawImage(this, 100,100);};
        // }
    }
}

let game = new Battle();

function enableKey(event) {
    let found = false;
    for (let i = 0; i < game.validKeys.length; i++) {
        if (game.validKeys[i] == event.key) {
            found = true;
            break;
        }
    }
    found = false;
    for (let i = 0; i < game.Actions.length; i++) {
        if (game.Actions[i] == event.key) {
            found = true;
            break;
        }
    }
    if (!found) {
        game.Actions.push(event.key);
    }
}
function disableKey(event) {
    let newAction = [];
    for (let i = 0; i < game.Actions.length; i++) {
        if (game.Actions[i] != event.key) {
            newAction.push(game.Actions[i]);
        }
    }
    game.Actions = newAction;
}

function pushPauseButton(button) {
    if (button.textContent == "Pause") {
        game.status = PAUSE;
        button.textContent = "Continue";
    }
    else {
        game.status = PLAYING;
        button.textContent = "Pause";
    }
}
function turnBack() {
    window.location.href = "index.html";
}

window.addEventListener("keydown", enableKey);
window.addEventListener("keyup", disableKey);
