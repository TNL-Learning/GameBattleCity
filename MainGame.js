class BattleCity {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.redraw = parseInt(1000 / FPS);
        this.listPlayer = [];
        this.ActionKey = '';
        this.Actions = [];
        this.listBullets = [];
        
        this.initialize();
    }

    initialize() {
        this.validKeys = [];
        for (let i = 0; i < mapControl.length; i++) {
            for (let j = 0; j < mapControl[i].length; j++) {
                this.validKeys.push(mapControl[i][j]);
            }
        }
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.canvas.width = VIEW_WIDTH;
        this.canvas.height = VIEW_HEIGHT;
        this.canvas.style.backgroundColor = "black";

        let map = new MapGame();
        map.createMap();
        this.terrain = map.listTerrain;
        this.lishHeadquarters = map.listHeadquarter;
        this.listGates = map.listGates;
        for (let i = 0; i < map.listPlayer.length; i++) {
            this.listPlayer.push(map.listPlayer[i]);
        }

        this.runing();
    }

    runing() {
        this.renderFrame();
        this.update();
        setTimeout(() => this.runing(), this.redraw);
    }


    update() {
        this.updateTankAction();
        this.updateBullet();
        this.updateTerrain();
    }

    updateTankAction() {
        if (!this.Actions) {
            return;
        }
        let needDestroy = false;
        let success = false;
        for (let i = 0; i < this.Actions.length; i++) {
            success = false;
            for (let j = 0; j < this.listPlayer.length; j++) {
                if (this.listPlayer[j].receiveMovingSignal(this.Actions[i])) {
                    if (!this.isTankHitTerrain(this.listPlayer[j])) {
                        success = true;
                    }
                    break;
                }
                if (this.listPlayer[j].receiveFireSignal(this.Actions[i], this.listBullets)) {
                    success = true;
                    break;
                }
            }
            if (!success) {
                this.Actions[i] = "";
                needDestroy = true;
            }
        }
        if (needDestroy) {
            let newAction = [];
            for (let i = 0; i < this.Actions.length; i++) {
                if (this.Actions[i] != "") {
                    newAction.push(this.Actions[i]);
                }
            }
            this.Actions = newAction;
        }
    }

    updateBullet() {
        let needToCheck = true;
        for (let i = 0; i < this.listBullets.length; i++) {
            if (this.listBullets[i].status == DESTROYED) {
                this.listBullets.splice(i, 1);
                i--;
                continue;
            }
            needToCheck = true;
            //check hit terrain:
            for (let j = 0; j < this.terrain.length; j++) {
                if (this.listBullets[i].isHitTerrain(this.terrain[j])) {
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }
            for (let j = i+1; j < this.listBullets.length; j++){
                if (this.listBullets[i].isHitBullet(this.listBullets[j])){
                    needToCheck = false;
                    break;
                }
            }
            if (!needToCheck) {
                continue;
            }
        }
    }

    updateTerrain() {
        for (let i = 0; i < this.terrain.length; i++){
            if (this.terrain[i].status == DESTROYED) {
                this.terrain.splice(i, 1);
                i--;
            }
        }
    }



    isTankHitTerrain(tank) {
        for (let i = 0; i < this.terrain.length; i++) {
            if (tank.isHitTerrain(this.terrain[i])) {
                // console.log("Tank hit terrain.");
                // console.log("Tank x = " + tank.x + ", y = " + tank.y);
                // console.log("Terrain x = " + this.terrain[i].x + ", y = " + this.terrain[i].y);
                return true;
            }

        }
        return false;
    }

    renderFrame() {
        this.context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        //console.log("This canvas is rendering...");
        for (let i = 0; i < this.lishHeadquarters.length; i++) {
            this.lishHeadquarters[i].render(this.context);
        }
        for (let i = 0; i < this.listPlayer.length; i++) {
            this.listPlayer[i].render(this.context);
        }
        for (let i = 0; i < this.listGates.length; i++) {
            this.listGates[i].render(this.context);
        }
        for (let i = 0; i < this.listBullets.length; i++) {
            this.listBullets[i].render(this.context);
        }
        for (let i = 0; i < this.terrain.length; i++) {
            this.terrain[i].render(this.context);
        }
    }








}

let game = new BattleCity();

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

window.addEventListener("keydown", enableKey);
window.addEventListener("keyup", disableKey);
