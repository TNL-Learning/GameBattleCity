class Tank {
    constructor(x, y, direction, id, pathImg) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.id = id;
        this.reloadTime = 0;
        this.status = REVIVAL;
        this.type = 0;
        this.HP = 1;
        this.level = 1;
        this.substep = 0;
        this.pathImg = pathImg;
        this.image = new Image();
        this.image.src = pathImg;
        this.OriginX= x;
        this.OriginY= y;
        this.life = 1;
        this.speed = TANK_SPEED;
        this.reloadBulletTime = TANK_TIME_RELOAD;
        this.scaleSpeed =1.0
        this.canRunOnWater = false;
        this.isDefended = false;
        this.initialize();
    }

    initialize(){
        switch (this.id) {
            case 0: case 1:
                this.type = 1;
                this.life = 3;
                break;
            case 2: case 3:
                this.type = 2;
                this.life = 3;
                break;
            default:
                this.type = 3;
                if (this.pathImg == "image/bot/Robot0.png"){
                    this.speed *= 1.2;
                    this.reloadBulletTime /= 1.2;
                }
                else if (this.pathImg == "image/bot/Robot1.png"){
                    this.canRunOnWater = true;
                    this.HP = 2;
                }
                else if (this.pathImg == "image/bot/Robot2.png"){
                    this.HP = 3;
                    this.level = 2;
                }
                break;
        }
        this.changeStatusTo(REVIVAL);
    }

    fire() {
        if (this.reloadTime > 0) {
            return null;
        }
        this.reloadTime = this.reloadBulletTime;
        let x = 0;
        let y = 0;
        switch (this.direction) {
            case LEFT:
                x = this.x - BULLET_HEIGHT;
                y = this.y + CELL_SIZE - parseInt(0.5 * BULLET_WIDTH);
                break;
            case RIGHT:
                x = this.x + BLOCK_SIZE;
                y = this.y + CELL_SIZE - parseInt(0.5 * BULLET_WIDTH);
                break;
            case UP:
                x = this.x + CELL_SIZE - parseInt(0.5 * BULLET_WIDTH);
                y = this.y - BULLET_HEIGHT;
                break;
            case DOWN:
                x = this.x + CELL_SIZE - parseInt(0.5 * BULLET_WIDTH);
                y = this.y + BLOCK_SIZE;
                break;
            default:
                return null;
        }

        return new Bullet(x, y, this.level, this.direction, this.type);
    }

    eatBulletCandy() {
        this.HP--;
        if (this.HP <= 0) {
            this.detroying();
        }
    }

    detroying() {
        this.life--;
        if (this.life > 0) {
            this.changeStatusTo(CRASHING);
        }
        else{
            this.changeStatusTo(DESTROYED);
        }
        
    }

    isHitTerrain(terrain) {
        if (this.direction == STAND) {
            return false;
        }
        if (terrain.type == FOREST_ID) {
            return false;
        }
        if (terrain.type == WATER_ID && this.canRunOnWater){
            return false;
        }
        if (this.x >= terrain.x + terrain.width) {
            return false;
        }
        if (this.x + BLOCK_SIZE <= terrain.x) {
            return false;
        }
        if (this.y >= terrain.y + terrain.height) {
            return false;
        }
        if (this.y + BLOCK_SIZE <= terrain.y) {
            return false;
        }
        switch (this.direction) {
            case LEFT:
                this.x = terrain.x + terrain.width;
                break;
            case RIGHT:
                this.x = terrain.x - BLOCK_SIZE;
                break;
            case UP:
                this.y = terrain.y + terrain.height;
                break;
            case DOWN:
                this.y = terrain.y - BLOCK_SIZE;
                break;
        }
        return true;
    }

    isHitOtherTank(tank){
        if (tank.status != EXISTING || this.status != EXISTING){
            return false;
        }
        if (this.x > tank.x + BLOCK_SIZE || this.x + BLOCK_SIZE < tank.x ||this.y > tank.y + BLOCK_SIZE || this.y + BLOCK_SIZE < tank.y){
            return false;
        }
        return true;
    }


    hitBoundary(){
        return (!this.isInView());
    }

    isInView() {
        if (this.x < 0) {
            this.x = 0;
            return false;
        }
        if (this.x + BLOCK_SIZE > VIEW_WIDTH) {
            this.x = VIEW_WIDTH - BLOCK_SIZE;
            return false;
        }
        if (this.y < 0) {
            this.y = 0;
            return false;
        }
        if (this.y + BLOCK_SIZE > VIEW_WIDTH) {
            this.y = VIEW_WIDTH - BLOCK_SIZE;
            return false;
        }
        return true;
    }

    goUp() {
        if (this.status != EXISTING){
            return true;
        }
        if (this.direction == UP) {
            this.y -= this.speed;
        }
        else {
            this.direction = UP;
        }
        return this.isInView();
    }
    goDown() {
        if (this.status != EXISTING){
            return true;
        }
        if (this.direction == DOWN) {
            this.y += this.speed;
        }
        else {
            this.direction = DOWN;
        }
        return this.isInView();
    }
    goLeft() {
        if (this.status != EXISTING){
            return true;
        }
        if (this.direction == LEFT) {
            this.x -= this.speed;
        }
        else {
            this.direction = LEFT;
        }
        return this.isInView();
    }
    goRight() {
        if (this.status != EXISTING){
            return true;
        }
        if (this.direction == RIGHT) {
            this.x += this.speed;
        }
        else {
            this.direction = RIGHT;
        }
        return this.isInView();
    }


    revival() {
        this.status = REVIVAL;
        this.substep = 15;
        this.image.src = "image/player/revival.png"
    }

    changeStatusTo(status) {
        this.status = status;
        switch (status) {
            case REVIVAL:
                this.substep = 42;
                this.image.src = "image/player/revival.png";
                this.x = this.OriginX;
                this.y = this.OriginY;
                break;
            case EXISTING:
                this.image.src = this.pathImg;
                break;
            case CRASHING:
                this.image.src = "image/destroy/destroyItem.png";
                this.status = CRASHING;
                this.substep = 8;
                break;
            case DESTROYED:
                break;
        }
    }


    render(ctx) {
        if (this.status == EXISTING) {
            ctx.drawImage(this.image, this.direction * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
            if (this.reloadTime > TANK_TIME_RELOAD - 10) {
                let image = new Image();
                image.src = "image/tank/fire.png";
                let x = this.x;
                let y = this.y;
                switch (this.direction) {
                    case LEFT:
                        x -= BLOCK_SIZE;
                        break;
                    case RIGHT:
                        x += BLOCK_SIZE;
                        break;
                    case UP:
                        y -= BLOCK_SIZE;
                        break;
                    case DOWN:
                        y += BLOCK_SIZE;
                        break;
                }
                ctx.drawImage(image, this.direction * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, x, y, BLOCK_SIZE, BLOCK_SIZE);
            }
            if (this.reloadTime > 0) {
                this.reloadTime--;
            }
        }
        else if (this.status == CRASHING) {
            if (this.substep < 0) {
                if (this.type == 1 || this.type == 2) {
                    this.changeStatusTo(REVIVAL);
                }
                else {
                    this.changeStatusTo(DESTROYED);
                }
                return;
            }
            ctx.drawImage(this.image, this.substep * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
            this.substep--;
        }
        else if (this.status == REVIVAL)
        {
            if (this.substep < 0) {
                this.changeStatusTo(EXISTING);
                return;
            }
            ctx.drawImage(this.image, parseInt(this.substep/7) * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
            this.substep--;
        }

    }

    renderScale(ctx, scale){
        let image = new Image();
        image.src =  this.pathImg;
        ctx.drawImage(image, this.direction * BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.x*scale, this.y*scale, BLOCK_SIZE*scale, BLOCK_SIZE*scale);
    }

}

