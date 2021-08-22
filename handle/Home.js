
class Headquarter {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.initializ();
    }

    initializ() {
        this.image = new Image();
        this.image.src = `image/headquarter/headquarter_${Math.floor(Math.random() * 20)}.png`;
        this.status = EXISTING;
        this.maxSubStep = 180;
        this.subStep = 0;
    }
    changeStatus() {
        this.status = CRASHING;
        this.subStep = 0;
    }
    render(ctx) {
        if (this.status == DESTROYED){
            return;
        }
        ctx.drawImage(this.image, this.x, this.y);
        if (this.status == CRASHING) {
            if (this.subStep == this.maxSubStep) {
                this.status = DESTROYED;
                return;
            }
            let image = new Image();
            image.src = "image/headquarter/destroy.png";
            let index = parseInt(this.subStep / 4);
            let indexX = index % 5;
            let indexY = parseInt(index / 5);
            ctx.drawImage(image, indexX * BLOCK_SIZE, indexY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
            this.subStep++;
        }
    }
    renderScale(ctx, scale){
        ctx.drawImage(this.image, this.x*scale, this.y*scale, BLOCK_SIZE*scale, BLOCK_SIZE*scale);
    }
}

class Gate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Open() {
        return new RobotTank(this.x, this.y);
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

        this.blocks = [];
        this.PlayerTeams = [];
        this.RobotTeam = [];
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
        this.Headquarter = new Headquarter(this.x, this.y, 1);
        let index = blockPosY * QUANTITY_CELL_ROW + blockPosX;
        this.index = index;
        this.ignorePosition = [index - 1 - QUANTITY_CELL_COL, index - QUANTITY_CELL_COL, index + 1 - QUANTITY_CELL_COL,
        index - 1, index, index + 1];
        let team = new PlayerTeam(1);
        switch (numGate) {
            case 2:
                this.ignorePosition.push(index + 2);
                team.addPlayer((blockPosX + 2) * BLOCK_SIZE - CELL_SIZE, blockPosY * BLOCK_SIZE, UP, 1);
            case 1:
                this.ignorePosition.push(index - 2);
                team.addPlayer((blockPosX - 2) * BLOCK_SIZE + CELL_SIZE, blockPosY * BLOCK_SIZE, UP, 0);
        }

        let block = new BlockTerrain(this.x - CELL_SIZE, this.y - CELL_SIZE, HOME_ID);
        block.setDimension(2 * BLOCK_SIZE, 3 * CELL_SIZE);
        for (let posY = this.y - CELL_SIZE; posY < this.y + BLOCK_SIZE; posY += CELL_SIZE) {
            for (let posX = this.x - CELL_SIZE; posX < this.x + CELL_SIZE + BLOCK_SIZE; posX += CELL_SIZE) {
                if (posX < this.x || posY < this.y || posX >= this.x + BLOCK_SIZE) {
                    block.addTerrain(new Terrain(posX, posY, BRICK1_ID));
                    block.addTerrain(new Terrain(posX, posY + HALF_CELL_SIZE, BRICK2_ID));
                }
            }
        }
        this.PlayerTeams.push(team);
        this.blocks.push(block);
        console.log(this.ignorePosition);
    }

    createHomeP2(numGate) {
        //let index = blockPosY * QUANTITY_CELL_ROW + blockPosX;
        let index = parseInt(QUANTITY_CELL_COL / 2);

        let blockPosX = index* BLOCK_SIZE;
        let blockPosY = 0;
        this.x = blockPosX;
        this.y = blockPosY;
        this.Headquarter = new Headquarter(this.x, this.y, 2);
        
        this.index = index;
        this.ignorePosition = [index - 1, index, index + 1,
        index - 1 + QUANTITY_CELL_COL, index + QUANTITY_CELL_COL, index + 1 + QUANTITY_CELL_COL];
        let team = new PlayerTeam(2);
        switch (numGate) {
            case 2:
                this.ignorePosition.push(index - 2);
                team.addPlayer((index - 2) * BLOCK_SIZE + CELL_SIZE, 0, DOWN, 3);
            case 1:
                this.ignorePosition.push(index + 2);
                team.addPlayer((index + 2) * BLOCK_SIZE - CELL_SIZE, 0, DOWN, 2);
        }
        let block = new BlockTerrain(this.x - CELL_SIZE, this.y, HOME_ID);
        block.setDimension(2 * BLOCK_SIZE, 3 * CELL_SIZE);
        for (let posY = this.y; posY < this.y + BLOCK_SIZE + CELL_SIZE; posY += CELL_SIZE) {
            for (let posX = this.x - CELL_SIZE; posX < this.x + CELL_SIZE + BLOCK_SIZE; posX += CELL_SIZE) {
                if (posX < this.x || posY >= this.y + BLOCK_SIZE || posX >= this.x + BLOCK_SIZE) {
                    block.addTerrain(new Terrain(posX, posY, BRICK2_ID));
                    block.addTerrain(new Terrain(posX, posY + HALF_CELL_SIZE, BRICK1_ID));
                }
            }
        }
        this.PlayerTeams.push(team);
        this.blocks.push(block);
        console.log(this.ignorePosition);
    }

    createHomeB() {
        let index = parseInt(QUANTITY_CELL_COL / 2);
        this.ignorePosition = [0, index, QUANTITY_CELL_COL - 1];

        let botTeam = new RobotTeam(3);
        botTeam.addPostition(0, 0);
        botTeam.addPostition(index*BLOCK_SIZE, 0);
        botTeam.addPostition((QUANTITY_CELL_COL - 1) * BLOCK_SIZE, 0);
        this.RobotTeam.push(botTeam);
    }
}