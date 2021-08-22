class BlockTerrain{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.terrain = [];
        this.tatus = EXISTING;
        this.initialize();
    }


    addTerrain(terrain){
        this.terrain.push(terrain);
    }
    setDimension(width, height){
        this.width = width;
        this.height = height;
    }


    isTankHit(tank){
        if ( this.x >= tank.x + BLOCK_SIZE || this.y >= tank.y+BLOCK_SIZE || this.x + this.width <= tank.x || this.y + this.height <= tank.y){
            return false;
        }
        for (let  i = 0; i< this.terrain.length; i++){
            if (tank.isHitTerrain(this.terrain[i])){
                return true;
            }
        }
        if (tank.id > 2){
            let a = 0;
        }
        return false;
    }

    isHitBullet(bullet){
        if (this.type == WATER_ID || this.type == FOREST_ID){
            return false;
        }
        if ( this.x > bullet.x + bullet.width || this.y > bullet.y+ bullet.height || this.x + this.width < bullet.x || this.y + this.height < bullet.y){
            return false;
        }
        if (this.type == HOME_ID ){
            console.log("home: x = "+this.x + " y = "+this.y );
            console.log("bullet: x = "+bullet.x + " y = "+bullet.y );
        }
        let result =  false;
        for (let  i = 0; i< this.terrain.length; i++){
            if (bullet.isHitTerrain(this.terrain[i])){
                result = true;
            }
        }
        if (result){
            bullet.status = CRASHING;
            
        }
        return result;
    }

    initialize(){
        this.createTerrain();
    }

    createTerrain(){
        switch (this.type) {
            case WATER_ID: case FOREST_ID:
                this.terrain.push(new Terrain(this.x, this.y, this.type));
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE;
                break;
            case BRICK1_ID:
                for (let k1 = 0; k1 < 2; k1++) {
                    for (let k2 = 0; k2 < 2; k2++) {
                        this.terrain.push(new Terrain(this.x + k2 * CELL_SIZE, this.y + k1 * CELL_SIZE, this.type))
                        this.terrain.push(new Terrain(this.x + k2 * CELL_SIZE, this.y + k1 * CELL_SIZE + HALF_CELL_SIZE, BRICK2_ID))
                    }
                }
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE;
                break;
            case CONCRETE_ID:
                for (let k1 = 0; k1 < 2; k1++) {
                    for (let k2 = 0; k2 < 2; k2++) {
                        this.terrain.push(new Terrain(this.x + k2 * CELL_SIZE, this.y + k1 * CELL_SIZE, this.type))
                    }
                }
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE;
                break;
        }
    }
    

    update(){
        for (let i = 0; i < this.terrain.length; i++) {
            if (this.terrain[i].status == DESTROYED) {
                this.terrain.splice(i, 1);
                i--;
            }
        }
        if (this.terrain.length == 0){
            this.status = DESTROYED;
            return false;
        }
    }

    render(ctx){
        for (let  i = 0; i < this.terrain.length; i++){
            this.terrain[i].render(ctx);
        }
    }

    renderScale(ctx, scale){
        for (let  i = 0; i < this.terrain.length; i++){
            this.terrain[i].renderScale(ctx, scale);
        }
    }

}