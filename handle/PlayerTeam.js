class PlayerTeam extends TeamManager {
    constructor(id) {
        super(id);
    }

    addPlayer(x, y, direction, id) {
        this.members.push(new Player(x, y, direction, id));
    }

    updateInfor(){
        let str = `<p><strong>Team ${this.id}: </strong></p>`;
        for (let i =this.members.length-1; i>= 0 ; i--){
            str+= `<p>Player ${this.members[i].id +1 }: ${this.members[i].life} UP.</p>`
        }
        return str;
    }

    isLoseThisBattle(){
        for (let i = 0; i< this.members.length; i++){
            if (this.members[i].status != DESTROYED){
                return false;
            }
        }
        return true;
    }

    updateAction(key, blocksTerrain, bullets){
        if (this.movementAction(key, blocksTerrain)){
            return true;
        }
        else if (this.fireAction(key, bullets)){
            return true;
        }
        return
    }
    movementAction(key, blocksTerrain){
        for (let i = 0; i < this.members.length; i++){
            if (this.members[i].receiveMovingSignal(key)) {
                for (let j = 0; j<blocksTerrain.length; j++ ){
                    if (blocksTerrain[j].isTankHit(this.members[i])){
                        break;
                    }
                }
                return true;
            }
        }
        return false;
    }
    fireAction(key, bullets){
        for (let i = 0; i < this.members.length; i++){
            if ( this.members[i].receiveFireSignal(key, bullets)){
                return true;
            }
        }
        return false;
    }
}