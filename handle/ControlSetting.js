let controlData = [];
let currentCell = "";
function createUI() {
    controlData = getControlData();
    let str = `
        <tr>
            <td>Player</td>
            <td>Move Left</td>
            <td>Move Up</td>
            <td>Move Right</td>
            <td>Move Up</td>
            <td>Fire</td>
        </tr>
    `;
    for (let i = 0; i < controlData.length; i++) {
        str += "<tr>";
        str += `<td>Player ${i + 1}</td>`;
        for (let j = 0; j < controlData[i].length; j++) {
            str += `<td id ="control-${i}-${j}" onClick = "focusToCell(this)">${findKey(controlData[i][j], false)}</td>`;
        }
        str += "</tr>";
    }
    let table = document.getElementById("map-control");
    table.innerHTML = str;
    currentCell = "control-0-0";
    changeToFocus(currentCell);
}

function getControlData() {
    let mapControlKey = loadData(CONTROL);
    if (mapControlKey.length == 0) {
        mapControlKey = mapControl;
        saveData(CONTROL, mapControlKey);
    }
    return mapControlKey;
}

function changeKey(cell) {
    let newKey = prompt("Change to key:");
    if (isValidKey(newKey)) {
        if (newKey.length == 1) {
            if (isExisted(newKey)) {
                alert(`key "${newKey}" is already existed. Please input another key!`);
            }
            else {
                cell.textContent = newKey;
            }
        }
        else {
            if (isExisted(findKey(newKey, false))) {
                cell.textContent = findKey(newKey, true);
            }
        }
    }
    else {
        alert("Changing key is not success because of invalid key!");
    }
}

function isExisted(key) {
    for (let i = 0; i < controlData.length; i++) {
        for (let j = 0; j < controlData[i].length; j++) {
            if (key == controlData[i][j]) {
                return true;
            }
        }
    }
    return false;
}

function isValidKey(key) {
    if (key.length == 1) {
        return true;
    }
    else if (key.length > 1) {
        for (let i = 0; i < mapKey[0].length; i++) {
            if (mapKey[0][i] == key) {
                return true;
            }
        }
    }
    return false;
}

function focusToCell(cell) {
    changeToNormal(currentCell);
    currentCell = cell.id;
    changeToFocus(currentCell);
}
function changeToNormal(cellID) {
    let cell = document.getElementById(cellID);
    if (cell) {
        cell.style.backgroundColor = "white";
        cell.style.color = "black";
    }
}
function changeToFocus(cellID) {
    let cell = document.getElementById(cellID);
    if (cell) {
        cell.style.backgroundColor = "black";
        cell.style.color = "white";
    }
}

function changeControlKey(event) {
    let newKey = event.key;
    if (!newKey) return;

    if (isExisted(newKey)) {
        alert(`key "${findKey(newKey, false)}" is already existed. Please input another key!`);
    }
    else {
        let cell = document.getElementById(currentCell);
        if (cell) {
            let strID = currentCell.split("-");
            controlData[strID[1]][strID[2]] = newKey;
            cell.innerHTML = findKey(newKey, false);
            jumpToNextCell();
        }
    }
}

function jumpToNextCell(){
    let strID = currentCell.split("-");
    let i = +strID[1];
    let j = +strID[2]+1;
    if (j > 4){
        j = 0;
        i = (i+1)%4;
    }
    changeToNormal(currentCell);
    currentCell = `control-${i}-${j}`;
    console.log(currentCell);
    changeToFocus(currentCell);
}

window.addEventListener("keydown", changeControlKey);


createUI();