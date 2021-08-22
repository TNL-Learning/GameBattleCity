
function getMap(mode, id) {
    let map = new MapGame(mode, id);
    map.createMap();
    return map;
}

function renderMap() {
    let id = document.getElementById("select-map").value;
    let mode = parseInt(document.getElementById("game-mode").value);
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let map = getMap(mode, id);
    console.log("-----------------------------------------");

    for (let i = 0; i < map.blocks.length; i++) {
        map.blocks[i].renderScale(ctx, 0.5);
    }
    for (let i = 0; i < map.PlayerTeams.length; i++) {
        //map.PlayerTeams[i].renderScale(ctx, 0.5);
        map.PlayerTeams[i].renderScale(ctx, 0.5);
    }
    for (let i = 0; i < map.RobotTeam.length; i++) {
        map.RobotTeam[i].createBeginRobot();
        map.RobotTeam[i].renderScale(ctx, 0.5);
    }
    for (let i = 0; i < map.listHeadquarter.length; i++) {
        map.listHeadquarter[i].renderScale(ctx, 0.5);
    }
    //render();
}

function render() {
    let option = document.getElementById("select-map");
    let id = option.id;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let map = getMap();
    console.log("-----------------------------------------");

    let delay = 50;
    for (let i = 0; i < map.blocks.length; i++) {
        setTimeout(map.blocks[i].renderScale(ctx, 0.5), delay);
    }
    for (let i = 0; i < map.PlayerTeams.length; i++) {
        setTimeout(map.PlayerTeams[i].renderScale(ctx, 0.5), delay);
    }
    for (let i = 0; i < map.RobotTeam.length; i++) {
        map.RobotTeam[i].createBeginRobot();
        setTimeout(map.RobotTeam[i].renderScale(ctx, 0.5), delay);
    }
    for (let i = 0; i < map.listHeadquarter.length; i++) {
        setTimeout(map.listHeadquarter[i].renderScale(ctx, 0.5), delay);
    }
}

function saveMap() {
    saveData(GAMEDATA, [parseInt(document.getElementById("game-mode").value), parseInt(document.getElementById("select-map").value)]);
}

function turnBack() {
    window.location.href = "index.html";
}