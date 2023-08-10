document.addEventListener('DOMContentLoaded', () => {
    const startbutton = document.getElementById("start");
    var timeToFinish = 0;
    let lastMovedPot = null;
//we defined the array here so that the stones go in the order we want them to
    const pots = [
        document.getElementById("1"),
        document.getElementById("2"),
        document.getElementById("3"),
        document.getElementById("4"),
        document.getElementById("5"),
        document.getElementById("6"),
        document.getElementById("upit"),
        document.getElementById("7"),
        document.getElementById("8"),
        document.getElementById("9"),
        document.getElementById("10"),
        document.getElementById("11"),
        document.getElementById("12"),
        document.getElementById("opppit")
      ]; 
      const playerpots = [
        document.getElementById("1"),
        document.getElementById("2"),
        document.getElementById("3"),
        document.getElementById("4"),
        document.getElementById("5"),
        document.getElementById("6")
      ]
      const agentpots = [
        document.getElementById("7"),
        document.getElementById("8"),
        document.getElementById("9"),
        document.getElementById("10"),
        document.getElementById("11"),
        document.getElementById("12"),
      ]
    let userScorePit = document.getElementById('upit'); // User's score pit
    let oppScorePit = document.getElementById('opppit'); //Opponent's Score pit
    var playing = false; //whether start button has been pressed or not, starts false
    var isPlayersTurn = true; // Player's turn by default

    startbutton.addEventListener('click', () => {
        clearLogs();
        updateLogs("Game start. Player has first turn.")
        pots.forEach(pot => {
          const circleContainers = pot.querySelectorAll('.circle-container');
          circleContainers.forEach(container => {
            container.remove();
          });
          if(pot!=userScorePit&&pot!=oppScorePit){
            const circleContainer = document.createElement('div');
            circleContainer.classList.add('circle-container');
            
            for (let i = 0; i < 3; i++) {
              const circle = document.createElement('div');
              circle.classList.add('circle');
              circleContainer.appendChild(circle);
            }
            
            pot.appendChild(circleContainer);
          }else{
            const circleContainer = document.createElement('div');
            circleContainer.classList.add('circle-container');
            pot.appendChild(circleContainer);
          }
        });
      
        playing = true;
    });      
    //event listener for each clickable pot
    playerpots.forEach(pot => {// Only allow clicking pots on the player's side
          pot.addEventListener('click', () => {
            if (playing && isPlayersTurn) { // Only allow clicking during player's turn
                distributeStones(pot); // Call the distributeStones function when a pot is clicked
            }
          });
        
    });
    
    function distributeStones(clickedPot) {
        updateLogs("Distributing stones...");
        const circleContainers = clickedPot.querySelectorAll('.circle-container');
        const totalStones = calculateStones(clickedPot); // Calculate the number of stones
        timeToFinish = totalStones * 500;
    
        if (totalStones === 0) {
            updateLogs("Pot chosen was empty.");
            return; // No stones to distribute
        }

        let sample = pots;

        if (isPlayersTurn) {
            // If it's the player's turn, exclude the opponent's score pit
            sample = Array.from(pots).filter((container) => container !== oppScorePit);
        } else {
            // If it's the agent's turn, exclude the player's score pit
            sample = Array.from(pots).filter(container => container !== userScorePit);
        }
        circleContainers.forEach(container => {

            const circles = container.querySelectorAll('.circle');
           
            circles.forEach((circle, index) => {
                setTimeout(() => {
                    const targetPotIndex = (Array.from(sample).indexOf(clickedPot) + index + 1) % sample.length;
                    const targetPot = sample[targetPotIndex];
                    const targetContainer = targetPot.querySelector('.circle-container'); // Get the target container
                    targetContainer.appendChild(circle); // Append the stone to the target container

                    if (index === circles.length - 1) {
                        lastMovedPot = targetPot; // Update the lastMovedPot
                        if (calculateStones(lastMovedPot) === 1){
                            const oppositePotIndex = 12 - pots.indexOf(lastMovedPot); // Calculate the index of the opposite pot
                            const oppositePot = pots[oppositePotIndex]; // Get the opposite pot
                            if(((isPlayersTurn && playerpots.includes(lastMovedPot)) || (!isPlayersTurn && agentpots.includes(lastMovedPot))) && calculateStones(oppositePot)!=0) {
                                    
                                    updateLogs("Capturing...")
                                    const oppositeStones = calculateStones(oppositePot); // Get the number of stones in the opposite pot
                                    const capturingStones = oppositeStones + 1; // Stones from the player's pot and the opposite pot
                            
                                    if (isPlayersTurn) {
                                        updateLogs("Player captured " +capturingStones +" stones!")
                                        for (let i = capturingStones; i > 0; i--) {
                                            const capturedStones = document.createElement('div'); // Create a new element to represent captured stones
                                            capturedStones.classList.add('circle');
                                            userScorePit.appendChild(capturedStones);
                                        }
                                        
                                    } else {
                                        updateLogs("Agent captured " +capturingStones +" stones!")
                                        for (let i = capturingStones; i > 0; i--) {
                                            const capturedStones = document.createElement('div'); // Create a new element to represent captured stones
                                            capturedStones.classList.add('circle');
                                            oppScorePit.appendChild(capturedStones);
                                        }
         
                                    }
                                     // Clear the circle-container elements inside the source and opposite pots
                                     const sourceCircleContainers = lastMovedPot.querySelectorAll('.circle-container');
                                     sourceCircleContainers.forEach(container => container.innerHTML = ''); // Remove stones from source pot
                                     const oppositeCircleContainers = oppositePot.querySelectorAll('.circle-container');
                                     oppositeCircleContainers.forEach(container => container.innerHTML = ''); // Remove stones from opposite pot
                            
                            }
                        } 
                        
                    }
                }, index * 500); // Adjust the delay between stone movements
            });
            
        });
        
        setTimeout(nextTurn, timeToFinish);
    }

//function returns number of stones in a pot
    function calculateStones(pot) {
        const stones = pot.querySelectorAll('.circle');
        return stones.length;
    }
    //changes turn to players
    function nextTurn() {
        if(gameIsOver()){
            declareWinner();
            playing = false;
            return;
        }
        if(isPlayersTurn){
            if (lastMovedPot === userScorePit) {
                isPlayersTurn = true; // Give extra turn to player if the last moved pot was their score pit
                updateLogs("Player gets extra turn!")
            } else {
                isPlayersTurn = false; // Switch back to agent's turn
                updateLogs("Agent's turn.")
                setTimeout(agentTurn, timeToFinish);
            }
        }else{
            if(lastMovedPot === oppScorePit){
                isPlayersTurn = false;
                updateLogs("Agent gets extra turn!")
                setTimeout(agentTurn, timeToFinish);
            }else{
                updateLogs("Player's turn.")
                isPlayersTurn = true;
            }
        }
    
    }
 
//agent takes its turn
    function agentTurn() {
        let bestMove = null;
        let bestEval = -Infinity;
        let depth=0;
        const fakeBoard =[];
        playerpots.forEach((pot) => {
            let numOfStones = calculateStones(pot);
            fakeBoard.push(numOfStones);
        })
        fakeBoard.push(calculateStones(userScorePit))
        agentpots.forEach((pot) => {
            let numOfStones = calculateStones(pot);
            fakeBoard.push(numOfStones)
        })
        fakeBoard.push(calculateStones(oppScorePit))
        updateLogs(fakeBoard)
        let state = {
            'board': [...fakeBoard],
            'extraTurn': false,
            'playerScore': calculateStones(userScorePit),    // Copy the player's score
            'agentScore': calculateStones(oppScorePit)       // Copy the agent's score
        };
        possibleMovesForAgent(state).forEach((move) => {
            let newState = applyMove(state,move[1]); // Apply the move to a new state
            let eval = minimax(newState, depth, false); // Depth controls how deep the agent looks ahead
            if (bestMove == null || eval > bestEval) {
                bestEval = eval;
                bestMove = pots[move[1]]; // Store the pot element, not the index
            }
        });
    
        distributeStones(bestMove);
    }

function possibleMovesForAgent(state) {
    // Implement a function to return an array of possible moves for the agent in the given state
        let agentPots=[];
        for(i=7;i<13;i++){
            agentPots.push([state.board[i], i]);
        }
        const possibleMoves = agentPots.filter((pot) => pot[0] > 0);
        return possibleMoves;
}

function possibleMovesForPlayer(state) {
     // Implement a function to return an array of possible moves for the agent in the given state
     let playerPots=[];
     for(i=0;i<6;i++){
         playerPots.push([state.board[i], i]);
     }
     const possibleMoves = playerPots.filter((pot) => pot[0] > 0);
     return possibleMoves;
}

function applyMove(state, move) {
    // Copy the current state to avoid modifying the original state
    let newState = {
            board: [...state.board],
            extraTurn: false,
            playerScore: state.playerScore,       // Copy the player's score
            agentScore: state.agentScore          // Copy the agent's score
        };
    const potIndex = move
    let stones= newState.board[potIndex]
    newState.board[potIndex] = 0
    let currentPotIndex = potIndex+1;
    while (stones> 0) {
        if (currentPotIndex === newState.board.length) {
            // Wrap around to player's pots
            currentPotIndex = 0;
        }
        // Distribute one stone to the current pot
        newState.board[currentPotIndex]++;
        stones--;

        currentPotIndex++;
    }

    // Check if the last stone landed in the player's score pit and give an extra turn if needed
    if (currentPotIndex - 1 === 13) {
        newState.extraTurn = true;
    } else {
        newState.extraTurn = false;
    }

    return newState;
}


function evaluate(state) {
    // Implement an evaluation function to assign a value to the state
    // Return a value indicating the agent's advantage in the state
    const agentScore = state.agentScore;
    const playerScore = state.playerScore;
    // Calculate the difference in Mancala scores
    const mancalaDifference = agentScore - playerScore;

    let extrascore=0;

    if(state.extraTurn){
        extrascore = 1;
    }
     // Combine these factors into an overall evaluation score
    // You can adjust the weights according to your strategy
    const extraWeight =0.5;
    const mancalaWeight = 0.3;

//still need to configure capture


    const totalScore = (
        mancalaDifference * mancalaWeight +
        extrascore * extraWeight
    );

    return totalScore;
}

    
    
    // Minimax algorithm
    function minimax(state, depth, isMaximizingPlayer) {
        if (gameIsOver(state)||depth==3) {
            return evaluate(state);
        }

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;
            possibleMovesForAgent(state).forEach((move) => {
                let newState = applyMove(state, move[1]);
                let eval = minimax(newState, depth+1, false);
                maxEval = Math.max(maxEval, eval);
            }) 
            return maxEval;
        } else {
            let minEval = Infinity;
            possibleMovesForAgent(state).forEach((move) => {
                let newState = applyMove(state, move[1]);
                let eval = minimax(newState, depth +1, true);
                minEval = Math.min(minEval, eval);
            })
            return minEval;
        }
    }

function gameIsOver(state) {
    let playerScore;
    let agentScore;
    let playerPossibleMoves;
    let agentPossibleMoves;

    if(!state){
        //if checking in actual game, calculate possible game moves real time
    playerScore = calculateStones(userScorePit);
    agentScore = calculateStones(oppScorePit);
    playerPossibleMoves = playerpots.filter(pot => calculateStones(pot) > 0);
    agentPossibleMoves = agentpots.filter(pot => calculateStones(pot) > 0);
    }else{
        //else check for the minimax algorithm whether or not the game is over by a potential move
        playerScore=state.playerScore;
        agentScore=state.agentScore;
        playerPossibleMoves = possibleMovesForPlayer(state);
        agentPossibleMoves = possibleMovesForAgent(state);
    }
    if (playerScore >= 19 || agentScore >= 19) {
        return true; // Condition 1: Check if any player has 19 or more stones in their score pit
    }

    if (playerPossibleMoves.length === 0 || agentPossibleMoves.length === 0) {
        return true; // Condition 2: Check if either player or agent has no possible moves
    }

    return false; // If neither of the above conditions are met, the game is not over
}

function updateLogs(message){
    const gamelog = document.getElementById("messages")
    const data = document.createElement("p");
    data.innerHTML = message;
    gamelog.appendChild(data);
    gamelog.scrollTop = gamelog.scrollHeight;
}

function clearLogs(){
    const gamelog = document.getElementById("messages")
    gamelog.innerHTML=""
}

    function declareWinner() {
        // Determine and print the winner
        if (calculateStones(userScorePit) > calculateStones(oppScorePit)) {
            updateLogs("Player wins!")
        } else if (calculateStones(userScorePit) < calculateStones(oppScorePit)) {
            updateLogs("Agent wins!")
        } else {
            updateLogs("It's a tie!")
        }
    }

});