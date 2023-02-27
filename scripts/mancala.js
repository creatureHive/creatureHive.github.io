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


//each player starts with these values
const board = [
[0,3,3,3,3,3,3], //0 is first players pit
[3,3,3,3,3,3,0]  //0 is second players pit
];

console.log(board);

//a turn
function moveStones(board){
    let choice= prompt("Which pot will you choose from: ");
    let stones = board[1,choice+1];
    for(i=0;i<stones;i++){
        
    }
}






