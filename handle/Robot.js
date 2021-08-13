class RobotTank extends Tank{
    constructor(x, y){
        super(x, y, DOWN, 4, `image/bot/Robot${Math.floor(Math.random()*3)}.png`);
    }
}