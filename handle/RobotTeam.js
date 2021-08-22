class RobotTeam extends TeamManager {
    constructor(id) {
        super(id);
        this.initialize();
    }

    initialize() {
        this.X = [];
        this.Y = [];
        this.numTankLeft = 12;
        this.upperLimit = 6;
        this.numPostition = 0;
        this.status = REVIVAL;
        this.addTankTime = 300;
        this.time = 0;
    }


    isLoseThisBattle(){
        return this.numTankLeft == 0 && this.members.length == 0 && this.status == EXISTING;
    }

    addPostition(x, y) {
        this.X.push(x);
        this.Y.push(y);
        this.numPostition++;
    }

    updateInfor() {
        let str = `
        <p><strong>Team Robot:</strong></p>
        <p>${this.numTankLeft} Tank(s) left.</p>
        `;
        return str;
    }

    autoControl(bullets, blockTerrain, playerTeams) {
        this.updateMember();
        if (this.status == REVIVAL) {
            for (let i = 0; i < this.numPostition; i++) {
                this.createRobot(i);
            }
            this.status = EXISTING;
            return;
        }
        else {
            if (this.time <=0 ){
                let index = Math.floor(Math.random() * this.numPostition);
                this.createRobot(index);
            }
            else if (this.members.length == 0){
                for (let i = 0; i < this.numPostition; i++) {
                    this.createRobot(i);
                }
            }
        }
        for (let i = 0; i < this.members.length; i++) {
            this.members[i].update(bullets);
        }
        this.checkIntersect(blockTerrain, playerTeams);
        this.updateTime();
    }
    checkIntersect(blockTerrain, playerTeams) {
        for (let i = 0; i < this.members.length; i++) {
            for (let j = 0; j < blockTerrain.length; j++) {
                if (blockTerrain[j].isTankHit(this.members[i])) {
                    this.members[i].forceChangeDerection();
                    break;
                }
            }
            for (let j = 0; j < playerTeams.length; j++) {
                for (let k = 0; k < playerTeams[j].members.length; k++) {
                    if (this.members[i].isHitOtherTank(playerTeams[j].members[k])) {
                        playerTeams[j].members[k].detroying();
                    }
                }
            }
            for (let j = i + 1; j < this.members.length; j++) {
                if (this.members[i].isHitOtherTank(this.members[j])) {
                    this.members[i].jumpBack();
                    this.members[j].jumpBack();
                    this.members[i].forceTurnBack();
                    this.members[j].forceTurnBack();
                    break;
                }
            }
        }
    }

    updateTime() {
        this.time = this.time > 0? this.time -1 : 0;
    }
    updateMember() {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].status == DESTROYED) {
                this.members.splice(i, 1);
                i--;
            }
        }
    }

    createBeginRobot() {
        for (let i = 0; i < this.numPostition; i++) {
            if (this.numTankLeft > 0) {
                this.members.push(new RobotTank(this.X[i], this.Y[i]));
            }
        }
    }




    createRobot(position){
        if (this.numTankLeft > 0 && this.members.length < this.upperLimit){
            for (let i = 0; i< this.members.length; i++) {
                if (this.members[i].isAtGate(this.X[position], this.Y[position])){
                    return;
                }
            }
            this.members.push(new RobotTank(this.X[position], this.Y[position]));
            this.numTankLeft--;
            this.time = this.addTankTime;
        }
    }

}
