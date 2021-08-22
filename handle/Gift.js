class Gift {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.time = 500;
        this.status = EXISTING;
        this.tag ="";
        this.tank = null;
        this.initialize();
    }
    initialize() {
        let path = "";
        switch (this.type) {
            case 0:
                path = "image/Gift/life.png";
                this.tag="1up";
                break;
            case 1:
                path = "image/Gift/boom.png";
                this.tag="boom";
                break;
            case 2:
                path= "image/Gift/bullet.png";
                this.tag="bullet";
                break;
            case 3:
                path = "image/Gift/Defend.png";
                this.tag="defend";
                break;
            case 4:
                path = "image/Gift/water.png";
                this.tag="water";
                break;
        }
        this.image = new Image();
        this.image.src = path;
        this.pathImg = path;
    }


    isHitTank(tank){
        if (this.status != EXISTING){
            return false;
        }
        if (this.x > tank.x + BLOCK_SIZE || this.x + BLOCK_SIZE < tank.x || this.y > tank.y + BLOCK_SIZE || this.y + BLOCK_SIZE < tank.y ){
            return false;
        }
        this.tank = tank;
        this.attachToTank(tank);
        return true;
    }

    attachToTank(tank){
        switch (this.type) {
            case 0:
                tank.life++;
                this.status = DESTROYED;
                break;
            case 1:
                this.status = TAKEN;
                break;
            case 2:
                this.time = 300;
                this.status = TAKEN;
                tank.level++;
                break;
            case 3:
                this.time = 300;
                this.status = TAKEN;
                tank.isDefended = true;
                break;
            case 4:
                this.time = 300;
                this.status = TAKEN;
                tank.canRunOnWater = true;
                break;
        }
    }

    detachFromTank(tank){
        switch (this.type) {
            case 0:
                break;
            case 1:
                this.status = DESTROYED;
                break;
            case 2:
                this.status = DESTROYED;
                tank.level--;
                break;
            case 3:
                this.status = DESTROYED;
                tank.isDefended = false;
                break;
            case 4:
                this.status = DESTROYED;
                tank.canRunOnWater = false;
                break;
        }
    }

    update(){
        this.time--;
        console.log("time = "+ this.time);
        if (this.time <= 0)
        {
            this.status = DESTROYED;
            if (this.tank){
                this.detachFromTank(this.tank);
            }
        }
    }

    render(ctx){
        if (this.status == EXISTING){
            ctx.drawImage(this.image, this.x, this.y);
        }
    }
}

class GiftStorage {
    constructor() {
        this.time = 0;
        this.store = [];
        this.resetTime();
    }

    resetTime() {
        this.time = 2000 + Math.floor(Math.random() * 400);
    }
    giveGift() {
        if (this.time  <= 0 && this.store.length< 3) {
            let x = Math.floor(Math.random() * (VIEW_WIDTH-BLOCK_SIZE));
            let y = Math.floor(Math.random() * (VIEW_HEIGHT -BLOCK_SIZE));
            let index = Math.floor(Math.random() * 5);
            let gift = new Gift(x, y, index);
            this.store.push(gift);
            this.resetTime();
        }
        else{
            this.time--;
        }
    }

    update(listPlayerTeam, listRobot){
        this.giveGift();
        for (let i = 0; i< this.store.length; i++) {
            if (this.store[i].status == DESTROYED){
                this.store.splice(i, 1);
                i--;
            }
        }
        let LuckyTeam = -1;
        for (let i = 0; i < listPlayerTeam.length; i++) {
            for (let j = 0; j < listPlayerTeam[i].members.length; j++) {
                for (let k = 0; k < this.store.length; k++){
                    if (this.store[k].isHitTank(listPlayerTeam[i].members[j])){
                        if (this.store[k].tag == "boom" && this.store[k].status == TAKEN){
                            LuckyTeam = this.store[k].tank.type;
                            this.store[k].status = DESTROYED;
                        }
                        break;
                    }
                }
            }
        }
        if (LuckyTeam == 1){
            for (let i = 1; i < listPlayerTeam.length; i++) {
                for (let j = 0; j < listPlayerTeam[i].members.length; j++) {
                    listPlayerTeam[i].members[j].detroying();
                }
            }
            for (let i = 1; i < listRobot.length; i++) {
                for (let j = 0; j < listRobot[i].members.length; j++) {
                    listRobot[i].members[j].detroying();
                }
            }
            LuckyTeam = -1;
        }
        else if (LuckyTeam == 2){
            for (let j = 0; j < listPlayerTeam[0].members.length; j++) {
                listPlayerTeam[0].members[j].detroying();
            }
            LuckyTeam = -1;
        }
        for (let i = 0; i < this.store.length; i++) {
            this.store[i].update();
        }
        //console.log("has "+ this.store.length + " gifts");
    }

    render(ctx){
        for (let i = 0; i < this.store.length; i++) {
            this.store[i].render(ctx);
        }
    }
}