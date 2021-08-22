class TeamManager {
    constructor(id) {
        this.id = id;
        this.initialized();
    }
    initialized(){
        this.members = [];
    }

    isHitBullet(bullet){
        if (this.id == bullet.type){
            return false;
        }
        for (let  i = 0; i < this.members.length; i++){
            if (bullet.isHitEnemy(this.members[i])) {
                return true;
            }
        }
        return false;
    }
    
    

    render(ctx) {
        for (let i = 0; i< this.members.length; i++){
            this.members[i].render(ctx);
        }
    }
    renderScale(ctx, scale) {
        for (let i = 0; i< this.members.length; i++){
            this.members[i].renderScale(ctx, scale);
        }
    }

}