class Player extends Tank{
    constructor(x, y, direction, id){
        super(x, y, direction,id, `image/player/TankPlayer${id +1}.png`);
        this.mapControl = [];
    }

    setControlKey(map){
        this.mapControl = map;
    }


    receiveFireSignal(key, listBullet) {
        if (key != this.mapControl[4]) {
            return false;
        }
        let bullet = this.fire();
        if (bullet) {
            listBullet.push(bullet);
        }
        return true;
    }
    receiveMovingSignal(key) {
        return this.onMoving(key);
    }

    getAction(key) {
        if (key == mapControl[this.id][4]) {
            return true;
        }
        return this.onMoving(key);
    }
    onMoving(key) {
        switch (key) {
            case this.mapControl[0]:
                return this.goLeft();
            case this.mapControl[1]:
                return this.goUp();
            case this.mapControl[2]:
                return this.goRight();
            case this.mapControl[3]:
                return this.goDown();
        }
        return false;
    }

}