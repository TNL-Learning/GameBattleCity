class RobotTank extends Tank {
    constructor(x, y) {
        super(x, y, DOWN, 4, `image/bot/Robot${Math.floor(Math.random() * 3)}.png`);
        this.initializeParam();
    }

    initializeParam() {
        this.decisionTime = 12;
        this.AutoFire = false;
    }


    update(bullets) {
        if (this.decisionTime == 0) {
            this.AutoFire = true;
        }
        if (this.AutoFire) {
            this.autoFire(bullets);
        }
        this.autoMove();
    }

    forceTurnBack() {
        this.direction = (this.direction + 2) % 4;
        this.decisionTime = 12;
    }

    forceChangeDerection() {
        this.decisionTime = 12;
        this.changeDirection(this.chooseDecision(true));
    }

    autoFire(listBullet) {
        let bullet = this.fire();
        if (bullet) {
            listBullet.push(bullet);
        }
    }

    jumpBack() {
        switch (this.direction) {
            case LEFT:
                this.x += this.speed;
                break;
            case RIGHT:
                this.x -= this.speed;
                break;
            case UP:
                this.y += this.speed;
                break;
            case DOWN:
                this.y -= this.speed;
                break;
            default:
                return null;
        }
    }

    isAtGate(x, y){
        if (this.x > x + BLOCK_SIZE || this.x +BLOCK_SIZE < x ||this.y > y + BLOCK_SIZE || this.y +BLOCK_SIZE < y){
            return false;
        }
        return true;
    }

    autoMove() {
        if (this.decisionTime == 0) {
            this.decisionTime = 12;
            this.changeDirection(this.chooseDecision(false));
        }
        this.decisionTime--;
        let canGoForward = true;
        switch (this.direction) {
            case LEFT:
                canGoForward = this.goLeft();
                break;
            case RIGHT:
                canGoForward = this.goRight();
                break;
            case UP:
                canGoForward = this.goUp();
                break;
            case DOWN:
                canGoForward = this.goDown();
                break;
        }
        if (!canGoForward) {
            this.forceTurnBack();
        }
    }





    chooseDecision(haveToChangeDirection) {
        let randValue = Math.floor(Math.random() * 100);
        if (!haveToChangeDirection) {
            if (randValue >= 90) {
                return "Turn back"
            }
            else if (randValue >= 75) {
                return "Turn left";
            }
            else if (randValue >= 60) {
                return "Turn right";
            }

            return "Go ahead";
        }
        else {
            if (randValue >= 80) {
                return "Turn back";
            }
            else if (randValue >= 40) {
                return "Turn left";
            }
            return "Turn right";
        }
    }

    changeDirection(dicision) {
        switch (dicision) {
            case "Turn left":
                this.direction = (this.direction + 3) % 4;
                break;
            case "Turn right":
                this.direction = (this.direction + 1) % 4;
                break;
            case "Turn back":
                this.direction = (this.direction + 2) % 4;
                break;
            default:
                break;
        }
    }



}