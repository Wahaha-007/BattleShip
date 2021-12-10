const ship = (name, length) => {

    let hitPos = [];

    const reducer = (a, b) => a + b;

    const isSink = () => {
        const sum = hitPos.reduce(reducer, 0);
        return sum >= length ? true : false;
    };

    const hit = (pos) => {
        if (pos < length) hitPos[pos] = 1;
    };

    return { hit, isSink, }
};

const gameboard = (boardId) => {

    const bSize = 10;
    let shipCount = 0;

    const Array2D = (r, c) => [...Array(r)].map(x => Array(c).fill(0));
    let placePos = Array2D(bSize, bSize); // 10x10, Y-X, row-column


    const checkValidPos = (y, x, dir, length) => {

        if (dir == '-') {
            if ((x + length) > (bSize)) return false; // X-Axis : Longer than baord array size

            for (let i = x; i < x + length; i++) {
                if (placePos[y][i] != 0) return false;
            }
        } else if (dir == '|') {
            if ((y + length) > (bSize)) return false; // Y-Axis : Longer than baord array size

            for (let i = y; i < y + length; i++) {
                if (placePos[i][x] != 0) return false;
            }
        }

        return true;
    }

    const placeShip = (shipId, y, x, dir, length) => { // id starts with 1,2,3...... : 0 is for empty

        if (!checkValidPos(y, x, dir, length)) return false;

        if (dir == '-') {
            for (let i = x; i < x + length; i++) { // Data point in the board start from 10....
                placePos[y][i] = shipId;
            }
        } else if (dir == '|') {
            for (let i = y; i < y + length; i++) {
                placePos[i][x] = shipId;
            }
        }

        shipCount++;

        return true;
    }

    const checkRemain = () => {

        let result = 0;

        for (let i = 1; i <= shipCount; i++) {
            if (checkLive(i) != 0) result++;
        }

        return result;
    }

    const checkLive = (shipId) => {

        let count = 0;

        for (let i = 0; i < bSize; i++) {
            for (let j = 0; j < bSize; j++) {
                if (placePos[i][j] == shipId) count++;
            }
        } // Can be better using forEach ?

        return count;
    }

    const getAttack = (y, x) => {

        let result;

        if ((y > bSize - 1) || (x > bSize - 1)) return false;

        if ((placePos[y][x] != 0) && (placePos[y][x] != 10)) result = true; // hit !
        else result = false; // missed !

        placePos[y][x] = 10; // Mark Attacked!

        return result;
    };

    const isAllSunk = () => {

        let sum = 0;

        for (let shipId = 1; shipId <= shipCount; shipId++) {
            sum += checkLive(shipId);
        }

        return sum == 0 ? true : false;
    };

    return { placePos, placeShip, checkLive, checkValidPos, checkRemain, getAttack, isAllSunk };
};

const player = (playerId) => {

    const bSize = 10;

    const Array2D = (r, c) => [...Array(r)].map(x => Array(c).fill(0));
    let playerPos = Array2D(bSize, bSize); // 10x10, Y-X, row-column

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    };

    const validatePos = (y, x) => {
        return playerPos[y][x] == 0 ? true : false;
    };

    const attackByAI = () => {

        let y, x;

        do {
            y = getRandomInt(bSize);
            x = getRandomInt(bSize);
        } while (!validatePos(y, x)); // May cause infinite loop!

        playerPos[y][x] = 1;

        return [y, x];
    };

    return { playerPos, attackByAI, validatePos }
};

const manageDom = (domId) => {

    const createGrid = (gSize, container) => {

        let gWidth = Math.round(400 / (gSize + 3));


        const cContainer = document.querySelector(container);

        for (let y = 0; y < gSize; y++) {

            const cRow = document.createElement('div');
            cRow.setAttribute("class", "gRow");
            cRow.setAttribute("owner", domId);

            for (let x = 0; x < gSize; x++) {
                const gCell = document.createElement('div');
                gCell.setAttribute("class", "gCell gDom" + domId + " gSel" + domId + y + x);
                gCell.setAttribute("owner", domId);
                gCell.setAttribute("y", y);
                gCell.setAttribute("x", x);

                gCell.style.width = gWidth + 'px';
                gCell.style.height = gWidth + 'px';
                cRow.appendChild(gCell);
            }
            cContainer.appendChild(cRow);
        }
    };


    const updateCell = (y, x, result) => {
        const gCell = document.querySelector(".gSel" + domId + y + x);

        if (result) {
            gCell.classList.add("hit");


        } else {
            gCell.classList.add("miss");
        }

    };

    const clearAllCell = () => {

        for (let k = 0; k < 10; k++) {
            for (let l = 0; l < 10; l++) {
                document.querySelector(".gSel" + domId + k + l).classList.remove("cursor");
            }
        }
    };

    const updateCursor = (domId, y, x, dir, length) => {

        if (dir == '|') {
            for (let j = y; j < y + length; j++) {
                document.querySelector(".gSel" + domId + j + x).classList.add("cursor");
            }
        } else {
            for (let i = x; i < x + length; i++) {
                document.querySelector(".gSel" + domId + y + i).classList.add("cursor");
            }
        }
    };

    const updateShip = (domId, y, x, dir, length) => {
        if (dir == '|') {
            for (let j = y; j < y + length; j++) {
                document.querySelector(".gSel" + domId + j + x).classList.add("ship");
            }
        } else {
            for (let i = x; i < x + length; i++) {
                document.querySelector(".gSel" + domId + y + i).classList.add("ship");
            }
        }
    };

    return { createGrid, updateCell, updateCursor, updateShip, clearAllCell };
};

/******************************** END CLASS SECTION **********************/

const playGame = () => {

    const hBoard = gameboard(0);
    const cBoard = gameboard(1);

    const hPlayer = player(0);
    const cPlayer = player(1);

    let playerDom = manageDom(0);
    let aiDom = manageDom(1);


    function initGame() { // Run Step 1.

        playerDom.createGrid(10, ".leftContainer");

    }

    function hPlaceShip() { // Run Step 2.

        let sSize = [5, 4, 3, 3, 2];
        let dir = '|';
        let index = 0;

        const hMessage = document.querySelector(".leftMessage");
        hMessage.textContent = "Place the ships, use space bar to rotate.";

        function moveCursor(e) {

            let mY = Number(e.target.getAttribute('y')); // 1.Get target Y,X 
            let mX = Number(e.target.getAttribute('x'));

            if (hBoard.checkValidPos(mY, mX, dir, sSize[index])) { // 2. Place-able position
                playerDom.clearAllCell();
                playerDom.updateCursor(0, mY, mX, dir, sSize[index]);
            } else {
                playerDom.clearAllCell();
            }
        }

        function placeIt(e) {
            let mY = Number(e.target.getAttribute('y')); // 1.Get target Y,X 
            let mX = Number(e.target.getAttribute('x'));

            if (hBoard.checkValidPos(mY, mX, dir, sSize[index])) { // 2.Place-able position

                hBoard.placeShip(index + 1, mY, mX, dir, sSize[index]); // 3. Put date into Object

                playerDom.updateShip(0, mY, mX, dir, sSize[index]); // 4.Update DOM display

                if (index < sSize.length - 1) {
                    index++;
                } else { // Complete placing process, reset event listener

                    gPlaces.forEach(key => key.removeEventListener('mouseover', moveCursor));
                    gPlaces.forEach(key => key.removeEventListener('click', placeIt));
                    document.removeEventListener('keydown', changeDir);

                    aiDom.createGrid(10, ".rightContainer");

                    const gCells = Array.from(document.querySelectorAll(".gDom1"));
                    gCells.forEach(key => key.addEventListener('click', playerAttack));
                }
            }
        }

        function changeDir(e) {
            if (e.key == ' ') { // Space bar

                if (dir == '|') {
                    dir = '-';

                } else {
                    dir = '|';
                }
            }
        }

        const gPlaces = Array.from(document.querySelectorAll('.gDom0'));
        gPlaces.forEach(key => key.addEventListener('mouseover', moveCursor));
        gPlaces.forEach(key => key.addEventListener('click', placeIt));
        document.addEventListener('keydown', changeDir);
    }

    function cPlaceShip() { // Run Step 3.

        function getR(max) {
            return Math.floor(Math.random() * max);
        }

        const sSize = [5, 4, 3, 3, 2];

        for (let i = 0; i < sSize.length; i++) {
            let result = false;

            do {
                const dir = getR(2) == 0 ? '-' : '|';

                result = cBoard.placeShip(i + 1, getR(10), getR(10), dir, sSize[i]);
            } while (!result);

        }


        /*cBoard.placeShip(1, 0, 9, '|', 3);
        cBoard.placeShip(2, 3, 2, '-', 5);
        cBoard.placeShip(3, 5, 3, '|', 4);
        cBoard.placeShip(4, 5, 7, '|', 3);
        cBoard.placeShip(5, 8, 7, '-', 2);
        */

    }

    /************************* END PLACE SHIP ***************************** */

    function aiAttack() {

        const dropPos = cPlayer.attackByAI(); // 1.Get target Y,X

        let sBefore = hBoard.checkRemain();
        const attackResult = hBoard.getAttack(dropPos[0], dropPos[1]); // 2.Put Y,X to board Object

        playerDom.updateCell(dropPos[0], dropPos[1], attackResult); // 3.Update DOM

        let attackMessage = attackResult == true ? 'and hits !' : 'but misses.';
        if (hBoard.checkRemain() < sBefore) attackMessage += ' One ship is sunk !';

        const hMessage = document.querySelector(".leftMessage");
        hMessage.textContent = `AI attacks at [${dropPos[0]}:${dropPos[1]}] ${attackMessage}`;
        // hMessage.textContent = `AI attacks ${attackMessage}`;

        if (hBoard.isAllSunk()) { // 4.Check result
            alert("All your ships are sunk. Computer win !")
        } else {

        }
    }


    function playerAttack(e) {

        let mY = Number(e.target.getAttribute('y')); // 1.Get target Y,X 
        let mX = Number(e.target.getAttribute('x'));

        if (!hPlayer.validatePos(mY, mX)) return false;
        hPlayer.playerPos[mY][mX] = 1;

        let sBefore = cBoard.checkRemain();
        const attackResult = cBoard.getAttack(mY, mX); // 2.Put Y,X to board Object


        aiDom.updateCell(mY, mX, attackResult); // 3.Update DOM

        let attackMessage = attackResult == true ? 'and hits !' : 'but misses.';
        if (cBoard.checkRemain() < sBefore) attackMessage += ' One ship is sunk !';

        const aMessage = document.querySelector(".rightMessage");
        aMessage.textContent = `Player attacks at [${mY}:${mX}] ${attackMessage}`;
        //aMessage.textContent = `Player attacks ${attackMessage}`;

        if (cBoard.isAllSunk()) { // 4.Check result
            alert("All computer ships are sunk. You win !")
        } else {
            aiAttack();
        }
    }


    initGame(); // Run Step 1.
    hPlaceShip(); // Run Step 2.
    cPlaceShip(); // Run Step 3.
    // hPlaceShip.End --> Trigger --> PlayerAttack // Run Step 4.
    // PlayerAttack.End --> Trigger --> AiAttack // Run Step 5.
};


playGame();


/************ DO TO ************ 10 Dec 2021, 23:12
 *  1. Separate logic part into different file for easy Jest.
 *  2. Use Ship Class
 *  3. Add drag and drop function for human ship placement
 *  
 * 
 */

/* Do not edit below this line 
module.exports = {
    ship,
    gameboard,
    player
};*/