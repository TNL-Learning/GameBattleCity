class Bullet {
    constructor(x, y, level, direction, type) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.direction = direction;
        this.type = type;
        this.image = new Image();
        this.image.src = `image/bullet/bullet_${direction}.png`;
        this.status = FLYING;
        this.subStep = 6;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        if (direction == LEFT || direction == RIGHT) {
            this.width = BULLET_HEIGHT;
            this.height = BULLET_WIDTH;
        }
    }

    destroy() {
        this.status = CRASHING;
    }

    isHitTerrain(terrain) {
        if (this.status != FLYING) {
            return true;
        }
        if (terrain.type == FOREST_ID || terrain.type == WATER_ID || terrain.status != EXISTING) {
            return false;
        }

        let deltaX = BULLET_HEIGHT;
        let deltaY = BULLET_HEIGHT;
        if (this.direction == LEFT || this.direction == RIGHT) {
            deltaY = BULLET_WIDTH;
        }
        else {
            deltaX = BULLET_WIDTH;
        }

        if (this.x > terrain.x + terrain.width) {
            return false;
        }
        if (this.x + deltaX < terrain.x) {
            return false;
        }
        if (this.y > terrain.y + terrain.height) {
            return false;
        }
        if (this.y + deltaY < terrain.y) {
            return false;
        }
        switch (this.direction) {
            case LEFT:
                this.x = terrain.x + terrain.width;
                break;
            case RIGHT:
                this.x = terrain.x - deltaX;
                break;
            case UP:
                this.y = terrain.y + terrain.height;
                break;
            case DOWN:
                this.y = terrain.y - deltaY;
                break;
        }
        if ( terrain.type != CONCRETE_ID){
            terrain.beginDestroying(); 
        }
        else{
            if (this.level > 1){
                terrain.beginDestroying();
            }
        }
        // if (this.level > 1 || terrain.type != CONCRETE_ID) {
        //     terrain.beginDestroying();
        // }
        return true;
    }

    isHitBullet(bullet) {
        if (this.status != FLYING) {
            return false;
        }
        if (bullet.status != FLYING) {
            return false;
        }
        if (this.type == bullet.type) {
            return false;
        }
        // if (this.direction == bullet.direction){
        //     return false;
        // }
        if (Math.abs(this.direction - bullet.direction) != 2) {
            return false;
        }
        if (this.x + this.image.width < bullet.x) {
            return false;
        }
        if (this.y + this.image.height < bullet.y) {
            return false;
        }
        if (this.x > bullet.x + bullet.image.width) {
            return false;
        }
        if (this.y > bullet.y + bullet.image.height) {
            return false;
        }

        this.destroy();
        bullet.destroy();
        return true;
    }

    isHitBoundary() {
        switch (this.direction) {
            case LEFT:
                if (this.x <= 0) {
                    this.x = 0;
                    this.status = CRASHING;
                    return true;
                }
                break;
            case RIGHT:
                if (this.x + BULLET_HEIGHT >= VIEW_WIDTH) {
                    this.x = VIEW_WIDTH - BULLET_HEIGHT;
                    this.status = CRASHING;
                    return true;
                }
                break;
            case UP:
                if (this.y <= 0) {
                    this.y = 0;
                    this.status = CRASHING;
                    return true;
                }
                break;
            case DOWN:
                if (this.y + BULLET_HEIGHT >= VIEW_HEIGHT) {
                    this.y = VIEW_HEIGHT - BULLET_HEIGHT;
                    this.status = CRASHING;
                    return true;
                }
                break;
            default:
                this.status = CRASHING;
                break;
        }
        return false;
    }


    isHitEnemy(tank) {
        if (this.status != FLYING) {
            return true;
        }
        if (tank.status != EXISTING){
            return false;
        }
        if (this.type == tank.type) {
            return false;
        }
        let deltaX = BULLET_HEIGHT;
        let deltaY = BULLET_HEIGHT;
        if (this.direction == LEFT || this.direction == RIGHT) {
            deltaY = BULLET_WIDTH;
        }
        else {
            deltaX = BULLET_WIDTH;
        }

        if (this.x > tank.x + BLOCK_SIZE) {
            return false;
        }
        if (this.x + deltaX < tank.x) {
            return false;
        }
        if (this.y > tank.y + BLOCK_SIZE) {
            return false;
        }
        if (this.y + deltaY < tank.y) {
            return false;
        }
        switch (this.direction) {
            case LEFT:
                this.x = tank.x + BLOCK_SIZE;
                break;
            case RIGHT:
                this.x = tank.x - deltaX;
                break;
            case UP:
                this.y = tank.y + BLOCK_SIZE;
                break;
            case DOWN:
                this.y = tank.y - deltaY;
                break;
        }
        this.destroy();
        tank.eatBulletCandy();
    }

    isHitHeadQuarter(headquarter){
        if (headquarter.status != EXISTING){
            return false;
        }
        if (this.x > headquarter.x + BLOCK_SIZE || this.y > headquarter.y + BLOCK_SIZE || this.x + this.width < headquarter.x || this.y + this.height < headquarter.y){
            return false;
        }
        return true;
    }




    fly() {
        if (this.canFly()) {
            switch (this.direction) {
                case LEFT:
                    this.x -= BULLET_SPEED;
                    break;
                case UP:
                    this.y -= BULLET_SPEED;
                    break;
                case RIGHT:
                    this.x += BULLET_SPEED;
                    break;
                case DOWN:
                    this.y += BULLET_SPEED;
                    break;
            }
        }
    }

    canFly() {
        if (this.status == FLYING) {
            return !this.isHitBoundary();
        }
        return false;
    }

    render(ctx) {
        switch (this.status) {
            case FLYING:
                ctx.drawImage(this.image, this.x, this.y);
                this.fly();
                //console.log("bullet x = " + this.x + ", y = " + this.y);
                break;
            case CRASHING:
                //console.log("Bullet substep = "+ this.subStep);

                if (this.subStep <= 0) {
                    this.status = DESTROYED;
                    break;
                }

                this.image.src = "image/destroy/destroyingBullet.png";
                let x = 0;
                let y = 0;
                let delta = parseInt(0.5 * BULLET_WIDTH) - CELL_SIZE;
                switch (this.direction) {
                    case LEFT:
                        x = this.x;
                        y = this.y + delta;
                        break;
                    case RIGHT:
                        x = this.x + BULLET_HEIGHT - BLOCK_SIZE;
                        y = this.y + delta;
                        break;
                    case UP:
                        x = this.x + delta;
                        y = this.y;
                        break;
                    case DOWN:
                        x = this.x + delta;
                        y = this.y + BULLET_HEIGHT - BLOCK_SIZE;
                        break;
                }
                let start = this.subStep > 3 ? 0 : BLOCK_SIZE;
                ctx.drawImage(this.image, this.direction * BLOCK_SIZE, start, BLOCK_SIZE, BLOCK_SIZE, x, y, BLOCK_SIZE, BLOCK_SIZE);
                this.subStep--;
                break;
            case DESTROYED:
                //console.log("Bullet is destroying");
                break;
        }
    }
}