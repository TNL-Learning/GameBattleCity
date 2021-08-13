class Player extends Tank{
    constructor(x, y, direction, id){
        super(x, y, direction,id, `image/player/TankPlayer${id +1}.png`);
        this.id = id;
    }
}