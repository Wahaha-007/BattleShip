const all = require('./script');

test('Test isSink', () => {

    const dShip = all.ship("Destroyer", 3);

    expect(dShip.isSink()).toBe(false);
    dShip.hit(0);
    expect(dShip.isSink()).toBe(false);
    dShip.hit(3);
    dShip.hit(2);
    expect(dShip.isSink()).toBe(false);
    dShip.hit(1);
    expect(dShip.isSink()).toBe(true);
});

test('Place ship', () => {

    const board0 = all.gameboard(0);

    expect(board0.placeShip(1, 8, 7, '-', 4)).toBe(false);
    expect(board0.placeShip(1, 8, 7, '-', 2)).toBe(true);


    //expect(board0.placeShip(1, 7, 7, 'x', 4)).toBe(false);
    //expect(board0.placeShip(1, 7, 8, 'y', 2)).toBe(true);

    /*   expect(all.gameboard.placeShip(1, 0, 0, 'x', 4)).toBe(true);
    expect(board.placePos[0][0]).toBe(true);
    expect(board.placePos[0][1]).toBe(true);
    expect(board.placePos[0][2]).toBe(true);
    expect(board.placePos[0][3]).toBe(true);
    expect(board.isAllSunk).toBe(false);
*/
});


test('Place overlap ship', () => {

    const board0 = all.gameboard(0);

    expect(board0.placeShip(1, 8, 7, '-', 2)).toBe(true);
    expect(board0.placeShip(1, 5, 7, '|', 3)).toBe(true);
    expect(board0.placeShip(1, 3, 2, '-', 4)).toBe(true);
    expect(board0.placeShip(1, 5, 3, '|', 4)).toBe(true);

    //expect(board0.placeShip(1, 7, 7, 'x', 4)).toBe(false);
    //expect(board0.placeShip(1, 7, 8, 'y', 2)).toBe(true);
});


test('Get attack & Check live', () => {

    const board0 = all.gameboard(0);

    expect(board0.placeShip(1, 8, 7, '-', 2)).toBe(true);
    expect(board0.placeShip(2, 5, 7, '|', 3)).toBe(true);
    expect(board0.placeShip(3, 3, 2, '-', 4)).toBe(true);
    expect(board0.placeShip(4, 5, 3, '|', 4)).toBe(true);

    expect(board0.checkLive(2)).toBe(3);
    expect(board0.getAttack(6, 7)).toBe(true);
    expect(board0.checkLive(2)).toBe(2);
    expect(board0.getAttack(6, 5)).toBe(false);
    expect(board0.getAttack(7, 7)).toBe(true);
    expect(board0.getAttack(5, 7)).toBe(true);
    expect(board0.checkLive(2)).toBe(0);

});

test('Test isAllSunk()', () => {

    const board0 = all.gameboard(0);

    expect(board0.placeShip(1, 8, 7, '-', 2)).toBe(true);
    expect(board0.placeShip(2, 5, 7, '|', 3)).toBe(true);


    expect(board0.checkLive(2)).toBe(3);
    expect(board0.getAttack(6, 7)).toBe(true);
    expect(board0.checkLive(2)).toBe(2);
    expect(board0.getAttack(6, 5)).toBe(false);
    expect(board0.getAttack(7, 7)).toBe(true);
    expect(board0.getAttack(5, 7)).toBe(true);
    expect(board0.checkLive(2)).toBe(0);

    expect(board0.isAllSunk()).toBe(false);
    expect(board0.getAttack(8, 7)).toBe(true);
    expect(board0.getAttack(8, 8)).toBe(true);
    expect(board0.isAllSunk()).toBe(true);

});

test('Test player placement', () => {

    const player0 = all.player(0);

    aPos = player0.attackAI();
    // console.log(aPos);
    expect(aPos[0]).toBeLessThan(10);
    expect(aPos[1]).toBeLessThan(10);

});