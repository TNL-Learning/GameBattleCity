class MapGame {
    constructor() {
        this.modeIndex = Math.floor(Math.random() * PLAYING_MODE.length);
        this.listTerrain = [];
        this.mapMatrix = [];
        this.listHeadquarter = [];
        this.listGates = [];
        this.listPlayer = [];
    }
    createMap() {
        switch (this.mapId) {
            case 1:
                break;
            default:
                this.createRandomMapMatrix();
                break;
        }
        let currentBlock = [];
        for (let i = 0; i < QUANTITY_CELL_ROW; i++) {
            for (let j = 0; j < QUANTITY_CELL_COL; j++) {
                if (this.mapMatrix[i][j] == EMPTY_ID) {
                    continue;
                }
                currentBlock = this.createBlock(j * BLOCK_SIZE, i * BLOCK_SIZE, this.mapMatrix[i][j]);
                for (let k = 0; k < currentBlock.length; k++) {
                    this.listTerrain.push(currentBlock[k]);
                }
            }
        }
    }

    createRandomMapMatrix() {

        //create Headquarters:
        let listIgnore = [];
        {
            let listType = PLAYING_MODE[this.modeIndex].split("vs");
            for (let index = 0; index < listType.length; index++) {
                let type = listType[index] == "B" ? listType[index] : listType[index] + (index + 1);
                let home = new Home(type);
                home.createHome();
                if (home.Headquarter) {
                    this.listHeadquarter.push(home.Headquarter);
                }
                for (let i = 0; i < home.listTerrain.length; i++) {
                    this.listTerrain.push(home.listTerrain[i]);
                }
                for (let i = 0; i < home.listGate.length; i++) {
                    this.listGates.push(home.listGate[i]);
                }
                for (let i = 0; i < home.listPlayer.length; i++) {
                    this.listPlayer.push(home.listPlayer[i]);
                }
                for (let i = 0; i < home.ignorePosition.length; i++) {
                    listIgnore.push(home.ignorePosition[i]);
                }
            }
            //arrange:
            listIgnore.sort(function (a, b) { return b - a });
        }
        let mapValue = this.createEmptyMap(1);
        let maxIndex = QUANTITY_CELL_COL * QUANTITY_CELL_ROW - 1;

        let temp = [];
        for (let i = 0; i < listIgnore.length; i++) {
            temp = mapValue[maxIndex];
            mapValue[maxIndex] = mapValue[listIgnore[i]];
            mapValue[listIgnore[i]] = temp;
            maxIndex--;
        }

        let numWater = Math.floor(7 * Math.random());
        let numForest = Math.floor(15 * Math.random());
        let numBrick = Math.floor(20 * Math.random());
        let numConcrete = Math.floor(10 * Math.random());

        let randIndex = 0;
        for (let i = 0; i < numWater; i++) {
            randIndex = Math.floor((maxIndex + 1) * Math.random());
            mapValue[randIndex][1] = WATER_ID;
            temp = mapValue[maxIndex];
            mapValue[maxIndex] = mapValue[randIndex];
            mapValue[randIndex] = temp;
            maxIndex--;
        }
        for (let i = 0; i < numForest; i++) {
            randIndex = Math.floor((maxIndex + 1) * Math.random());
            mapValue[randIndex][1] = FOREST_ID;
            temp = mapValue[maxIndex];
            mapValue[maxIndex] = mapValue[randIndex];
            mapValue[randIndex] = temp;
            maxIndex--;
        }
        for (let i = 0; i < numBrick; i++) {
            randIndex = Math.floor((maxIndex + 1) * Math.random());
            mapValue[randIndex][1] = BRICK1_ID;
            temp = mapValue[maxIndex];
            mapValue[maxIndex] = mapValue[randIndex];
            mapValue[randIndex] = temp;
            maxIndex--;
        }
        for (let i = 0; i < numConcrete; i++) {
            randIndex = Math.floor((maxIndex + 1) * Math.random());
            mapValue[randIndex][1] = CONCRETE_ID;
            temp = mapValue[maxIndex];
            mapValue[maxIndex] = mapValue[randIndex];
            mapValue[randIndex] = temp;
            maxIndex--;
        }

        this.mapMatrix = this.createEmptyMap(3);
        let size = mapValue.length;
        let rowIndex = 0;
        let colIndex = 0;
        for (let i = 0; i < size; i++) {
            if (mapValue[i][1] == EMPTY_ID) {
                continue;
            }
            rowIndex = parseInt(mapValue[i][0] / QUANTITY_CELL_COL);
            colIndex = mapValue[i][0] % QUANTITY_CELL_COL;
            this.mapMatrix[rowIndex][colIndex] = mapValue[i][1];
        }
        console.log(this.mapMatrix);

    }
    createEmptyMap(dim) {
        let matrixValue = [];
        if (dim == 1) {
            let size = QUANTITY_CELL_COL * QUANTITY_CELL_ROW;
            let row = [];
            for (let i = 0; i < size; i++) {
                row.push(i);
            }
            let listValue = new Array(QUANTITY_CELL_COL * QUANTITY_CELL_ROW).fill(EMPTY_ID);
            for (let i = 0; i < size; i++) {
                matrixValue.push([row[i], listValue[i]]);
            }
        }
        else if (dim == 2) {
            matrixValue = new Array(QUANTITY_CELL_ROW).fill(new Array(QUANTITY_CELL_COL).fill(EMPTY_ID));
        }
        else if (dim = 3) {
            for (let i = 0; i < QUANTITY_CELL_ROW; i++) {
                matrixValue.push([]);
                for (let j = 0; j < QUANTITY_CELL_COL; j++) {
                    matrixValue[i].push(EMPTY_ID);
                }
            }
        }
        return matrixValue;
    }


    createBlock(x, y, type) {
        let outTerrain = [];
        switch (type) {
            case WATER_ID: case FOREST_ID:
                outTerrain.push(new Terrain(x, y, type));
                break;
            case BRICK1_ID:
                for (let k1 = 0; k1 < 2; k1++) {
                    for (let k2 = 0; k2 < 2; k2++) {
                        outTerrain.push(new Terrain(x + k2 * CELL_SIZE, y + k1 * CELL_SIZE, type))
                        outTerrain.push(new Terrain(x + k2 * CELL_SIZE, y + k1 * CELL_SIZE + HALF_CELL_SIZE, type+1))
                    }
                }
                break;
            case CONCRETE_ID:
                for (let k1 = 0; k1 < 2; k1++) {
                    for (let k2 = 0; k2 < 2; k2++) {
                        outTerrain.push(new Terrain(x + k2 * CELL_SIZE, y + k1 * CELL_SIZE, type))
                    }
                }
                break;
        }
        return outTerrain;
    }

}