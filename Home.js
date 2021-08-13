
class Headquarter {
    constructor(x, y, path) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = path;
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

class Gate {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.image = new Image();
        this.image.src = "image/bot/bot_1.png";
    }
    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

class Home {
    constructor(strType) {
        this.type = strType;
        this.listTerrain = [];
        this.ignorePosition = [];
        this.Home = [];
        this.Headquarter = null;
        this.index = 0;
        this.listGate = [];
        this.listPlayer = [];
    }


    createHome() {
        if (this.type == "P1") {
            this.createHomeP1(1);
        }
        else if (this.type == "PP1") {
            this.createHomeP1(2);
        }
        else if (this.type == "P2") {
            this.createHomeP2(1);
        }
        else if (this.type == "PP2") {
            this.createHomeP2(2);
        }
        else {
            this.createHomeB();
        }
    }

    createHomeP1(numGate) {
        let blockPosX = parseInt(QUANTITY_CELL_COL / 2);
        let blockPosY = QUANTITY_CELL_ROW - 1;
        this.x = blockPosX * BLOCK_SIZE;
        this.y = blockPosY * BLOCK_SIZE;

        let path =`image/headquarter/headquarter_${Math.floor(Math.random()*20)}.png`;
        this.Headquarter = new Headquarter(this.x, this.y, path);
        let index = blockPosY * QUANTITY_CELL_ROW + blockPosX;
        this.index = index;
        this.ignorePosition = [index - 1 - QUANTITY_CELL_COL, index - QUANTITY_CELL_COL, index + 1 - QUANTITY_CELL_COL,
        index - 1, index, index + 1];
        switch (numGate) {
            case 2:
                this.ignorePosition.push(index + 2);
                this.listPlayer.push(new Player((blockPosX + 2) * BLOCK_SIZE - CELL_SIZE, blockPosY * BLOCK_SIZE, UP, 1));
            case 1:
                this.ignorePosition.push(index - 2);
                this.listPlayer.push(new Player((blockPosX - 2) * BLOCK_SIZE + CELL_SIZE, blockPosY * BLOCK_SIZE, UP, 0));
        }
        for (let posY = this.y - CELL_SIZE; posY < this.y + BLOCK_SIZE; posY += CELL_SIZE) {
            for (let posX = this.x - CELL_SIZE; posX < this.x + CELL_SIZE + BLOCK_SIZE; posX += CELL_SIZE) {
                if (posX < this.x || posY < this.y || posX >= this.x + BLOCK_SIZE) {
                    this.listTerrain.push(new Terrain(posX, posY, BRICK1_ID));
                    this.listTerrain.push(new Terrain(posX, posY+ HALF_CELL_SIZE, BRICK2_ID));
                }
            }
        }

    }

    createHomeP2(numGate) {
        let blockPosX = parseInt(QUANTITY_CELL_COL / 2);
        let blockPosY = 0;
        this.x = blockPosX * BLOCK_SIZE;
        this.y = blockPosY * BLOCK_SIZE;

        let path =`image/headquarter/headquarter_${Math.floor(Math.random()*20)}.png`;
        console.log("home 2: "+path);
        this.Headquarter = new Headquarter(this.x, this.y, path);
        let index = blockPosY * QUANTITY_CELL_ROW + blockPosX;
        this.index = index;
        this.ignorePosition = [index - 1, index, index + 1,
        index - 1 + QUANTITY_CELL_COL, index + QUANTITY_CELL_COL, index + 1 + QUANTITY_CELL_COL];
        switch (numGate) {
            case 2:
                this.ignorePosition.push(index + 2);
                this.listPlayer.push(new Player((blockPosX - 2) * BLOCK_SIZE + CELL_SIZE, blockPosY * BLOCK_SIZE, DOWN, 3));
                //this.listGate.push(new Gate((blockPosX - 2) * BLOCK_SIZE + CELL_SIZE, blockPosY * BLOCK_SIZE, "P"));
            case 1:
                this.ignorePosition.push(index - 2);
                this.listPlayer.push(new Player((blockPosX + 2) * BLOCK_SIZE - CELL_SIZE, blockPosY * BLOCK_SIZE, DOWN, 2));
                //this.listGate.push(new Gate((blockPosX + 2) * BLOCK_SIZE - CELL_SIZE, blockPosY * BLOCK_SIZE, "P"));
        }
        
        for (let posY = this.y; posY < this.y + BLOCK_SIZE + CELL_SIZE; posY += CELL_SIZE) {
            for (let posX = this.x - CELL_SIZE; posX < this.x + CELL_SIZE + BLOCK_SIZE; posX += CELL_SIZE) {
                if (posX < this.x || posY >= this.y + BLOCK_SIZE || posX >= this.x + BLOCK_SIZE) {
                    this.listTerrain.push(new Terrain(posX, posY, BRICK2_ID));
                    this.listTerrain.push(new Terrain(posX, posY+HALF_CELL_SIZE, BRICK1_ID));
                }
            }
        }

    }

    createHomeB() {
        let blockPosX = parseInt(QUANTITY_CELL_COL / 2);
        let blockPosY = 0;
        let index = blockPosX * QUANTITY_CELL_ROW + blockPosY;
        this.ignorePosition = [0, index, QUANTITY_CELL_COL - 1];

        this.listGate.push(new Gate(0, 0, "B"));
        this.listGate.push(new Gate(blockPosX * BLOCK_SIZE, 0, "B"));
        this.listGate.push(new Gate((QUANTITY_CELL_COL - 1)* BLOCK_SIZE, 0, "B"));
    }
}