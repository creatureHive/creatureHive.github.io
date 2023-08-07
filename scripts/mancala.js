//OKAY, make the mancala ai
//lets do it now

//yay

//OK

//TERMS:
//pot: holds stones. Starts at 3 stones.
//pit: score pots, one for each player
//stone: the marbles that are put in the pits or pots

//what do we need:
// board setup: two players, each player has six pots and one 
// score pot.

//basic rules:

//score pits start at 0 
//each pot holds 3 stones at start

const board = [
    [0, 4, 4, 4, 4, 4, 4],  // Player 1's pits
    [4, 4, 4, 4, 4, 4, 0]   // Player 2's pits
];

let playerTurn = true;  // Player 1 starts


function moveStones(playerIndex, pitIndex) {
    const stonesToMove = board[playerIndex][pitIndex];
    board[playerIndex][pitIndex] = 0;

    let currentPlayerIndex = playerIndex;
    let currentPitIndex = pitIndex;

    while (stonesToMove > 0) {
        currentPitIndex = (currentPitIndex + 1) % 7;  // Circular pit indexing
        
        if (currentPlayerIndex === 1 && currentPitIndex === 0) {
            continue;  // Skip opponent's Mancala pit
        }

        board[currentPlayerIndex][currentPitIndex]++;
        stonesToMove--;
    }
}
function captureStones(playerIndex, pitIndex) {
    const stonesCaptured = board[playerIndex][pitIndex];
    if (stonesCaptured === 1 && board[playerIndex][pitIndex] === 0) {
        const oppositePitIndex = 6 - pitIndex;  // Calculate the opposite pit index
        const capturedStones = board[oppositePlayerIndex][oppositePitIndex];
        
        board[oppositePlayerIndex][oppositePitIndex] = 0;
        board[playerIndex][6] += capturedStones + 1;  // Add captured stones to player's Mancala
    }
}

function playGame(pitIndex) {
    if (playerTurn) {
        moveStones(0, pitIndex);
        captureStones(0, pitIndex);
    } else {
        moveStones(1, pitIndex);
        captureStones(1, pitIndex);
    }

    // Switch turns
    playerTurn = !playerTurn;
}






