class Terrain {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.image = null;
        this.width = 0;
        this.height = 0;
        this.index = 0;
        this.status = EXISTING;
        this.initalize();
        this.subStep = 0;
    }
    initalize() {
        this.image = new Image();
        switch (this.type) {
            case WATER_ID:
                this.image.src = "image/terrain/water.jpg";
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE;
                break;
            case FOREST_ID:
                this.image.src = "image/terrain/forest.png";
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE;
                break;
            case BRICK1_ID:
                this.image.src = "image/terrain/brick1.jpg";
                this.width = CELL_SIZE;
                this.height = HALF_CELL_SIZE;
                break;
            case BRICK2_ID:
                this.image.src = "image/terrain/brick2.jpg";
                this.width = CELL_SIZE;
                this.height = HALF_CELL_SIZE;
                break;
            case CONCRETE_ID:
                this.image.src = "image/terrain/concrete.jpg";
                this.width = CELL_SIZE;
                this.height = CELL_SIZE;
                break;
        }



    }

    beginDestroying() {
        this.status = CRASHING;
        this.image.src = "image/destroy/destroyItem.png";
        this.x = this.x + parseInt(0.5 * this.width) - CELL_SIZE;
        this.y = this.y + parseInt(0.5 * this.height) - CELL_SIZE;
        this.index = 7;
    }

    render(ctx) {
        if (this.status == EXISTING) {
            if (this.type == WATER_ID) {
                ctx.drawImage(this.image, this.index * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
                this.index = (this.index + 1) % 8;
            }
            else {
                ctx.drawImage(this.image, this.x, this.y);
            }
        }
        else if (this.status == CRASHING) {
            if (this.index <= 0) {
                this.status = DESTROYED;
                return;
            }
            ctx.drawImage(this.image, this.index * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
            this.index--;
        }
    }
    renderScale(ctx, scale){
        let scaleSize =  BLOCK_SIZE*scale;
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x*scale, this.y*scale, this.width*scale, this.height*scale);
    }
}