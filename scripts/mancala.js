document.addEventListener('DOMContentLoaded', () => {
    const startbutton = document.getElementById("start");
    let scoreboard = document.getElementById("scoreboard");
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
        console.log("Distributing stones...");
        const circleContainers = clickedPot.querySelectorAll('.circle-container');
        const totalStones = calculateStones(clickedPot); // Calculate the number of stones
        timeToFinish = totalStones * 500;
    
        if (totalStones === 0) {
            console.log("Pot chosen was empty.");
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
                                    
                                    console.log("Capturing...")
                                    const oppositeStones = calculateStones(oppositePot); // Get the number of stones in the opposite pot
                                    const capturingStones = oppositeStones + 1; // Stones from the player's pot and the opposite pot
                            
                                    if (isPlayersTurn) {
                                        console.log("Player captured " +capturingStones +" stones!")
                                        for (let i = capturingStones; i > 0; i--) {
                                            const capturedStones = document.createElement('div'); // Create a new element to represent captured stones
                                            capturedStones.classList.add('circle');
                                            userScorePit.appendChild(capturedStones);
                                        }
                                        
                                    } else {
                                        console.log("Agent captured " +capturingStones +" stones!")
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
                console.log("Player gets extra turn!");
            } else {
                isPlayersTurn = false; // Switch back to agent's turn
                console.log("Agent's turn.");
                setTimeout(agentTurn, timeToFinish);
            }
        }else{
            if(lastMovedPot === oppScorePit){
                isPlayersTurn = false;
                console.log("Agent gets extra turn!");
                setTimeout(agentTurn, timeToFinish);
            }else{
                console.log("Player's turn.");
                isPlayersTurn = true;
            }
        }
    
    }
 
//agent takes its turn
    function agentTurn() {
        let bestMove = null;
        let bestEval = -Infinity;
        let depth = 0;
        let state = null;

        let move;
        

        possibleMovesForAgent(state).forEach((attempt) => {
            move = {
                'selectedPotIndex': possibleMovesForAgent().indexOf(attempt),
                'pot':attempt
            }
            let newState = applyMove(state,move); // Apply the move to a new state
            let eval = minimax(newState, depth, false); // Depth controls how deep the agent looks ahead
            if(bestMove == null){
                bestMove = move.pot;
            }
            if (eval > bestEval) {
                bestEval = eval;
                bestMove = move.pot;
            }
        });
    
        distributeStones(bestMove);
    }
    
    
    // Minimax algorithm
    function minimax(state, depth, isMaximizingPlayer) {
        if (depth === 0 || gameIsOver(state)) {
            return evaluate(state);
        }

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;
            for (let move of possibleMovesForAgent(state)) {
                let newState = applyMove(state, move);
                let eval = minimax(newState, depth - 1, false);
                maxEval = Math.max(maxEval, eval);
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let move of possibleMovesForPlayer(state)) {
                let newState = applyMove(state, move);
                let eval = minimax(newState, depth - 1, true);
                minEval = Math.min(minEval, eval);
            }
            return minEval;
        }
    }

function gameIsOver(state) {
    // Implement the game-over condition check based on the game state
    // Return true if the game is over, otherwise false
    const playerScore = calculateStones(userScorePit);
    const agentScore = calculateStones(oppScorePit);
    const playerPossibleMoves = possibleMovesForPlayer(state);
    const agentPossibleMoves = possibleMovesForAgent(state);

    if (playerScore >= 19 || agentScore >= 19) {
        return true; // Condition 1: Check if any player has 19 or more stones in their score pit
    }

    if (playerPossibleMoves.length === 0 || agentPossibleMoves.length === 0) {
        return true; // Condition 2: Check if either player or agent has no possible moves
    }

    return false; // If neither of the above conditions are met, the game is not over
}

function gameIsOver() {
    // Implement the game-over condition check based on the game state
    // Return true if the game is over, otherwise false
    const playerScore = calculateStones(userScorePit);
    const agentScore = calculateStones(oppScorePit);

    // Calculate the number of possible moves for the player and agent
    const playerPossibleMoves = playerpots.filter(pot => calculateStones(pot) > 0);
    const agentPossibleMoves = agentpots.filter(pot => calculateStones(pot) > 0);

    if (playerScore >= 19 || agentScore >= 19) {
        return true; // Condition 1: Check if any player has 19 or more stones in their score pit
    }

    if (playerPossibleMoves.length === 0 || agentPossibleMoves.length === 0) {
        return true; // Condition 2: Check if either player or agent has no possible moves
    }

    return false; // If neither of the above conditions are met, the game is not over
}


function evaluate(state) {
    // Implement an evaluation function to assign a value to the state
    // Return a value indicating the agent's advantage in the state
    const agentScore = state.agentScore;
    const playerScore = state.playerScore;

    // Calculate the number of stones in the agent's and player's pits
    const agentPotStones = state.agentPots.reduce((sum, stones) => sum + stones, 0);
    const playerPotStones = state.playerPots.reduce((sum, stones) => sum + stones, 0);

    // Calculate the difference in stones between the agent and player
    const stonesDifference = agentPotStones - playerPotStones;

    // Calculate the difference in Mancala scores
    const mancalaDifference = agentScore - playerScore;
     // Combine these factors into an overall evaluation score
    // You can adjust the weights according to your strategy
    const stonesWeight = 0.5;
    const mancalaWeight = 0.3;

//still need to configure capture


    const totalScore = (
        stonesDifference * stonesWeight +
        mancalaDifference * mancalaWeight
    );

    return totalScore;
}

function possibleMovesForAgent(state) {
    // Implement a function to return an array of possible moves for the agent in the given state
    let newState;
    // Copy the current state to avoid modifying the original state
    if(state==null){
        newState = {
            playerPots: playerpots.slice(), // Copy the player's pots array
            agentPots: agentpots.slice(),   // Copy the agent's pots array
            playerScore: calculateStones(userScorePit),    // Copy the player's score
            agentScore: calculateStones(oppScorePit)       // Copy the agent's score
        };
        return newState.agentPots.filter((pot) => calculateStones(pot) > 0)
    }else{
        const possibleMoves = state.agentPots.filter((pot) => calculateStones(pot) > 0);
        return possibleMoves;
    }
    //selectedPotIndex needed in each move object
}

function possibleMovesForPlayer(state) {
    // Implement a function to return an array of possible moves for the player in the given state
    const possibleMoves = state.playerPots.filter((pot) => calculateStones(pot) > 0);
    return possibleMoves;
}

function applyMove(state, move) {
    let newState;
    // Copy the current state to avoid modifying the original state
    if(state==null){
        newState = {
            playerPots: playerpots.slice(), // Copy the player's pots array
            agentPots: agentpots.slice(),   // Copy the agent's pots array
            playerScore: calculateStones(userScorePit),    // Copy the player's score
            agentScore: calculateStones(oppScorePit)       // Copy the agent's score
        };
    }else{
        newState = {
            playerPots: state.playerPots.slice(), // Copy the player's pots array
            agentPots: state.agentPots.slice(),   // Copy the agent's pots array
            playerScore: state.playerScore,       // Copy the player's score
            agentScore: state.agentScore          // Copy the agent's score
        };
    }
    // Distribute the stones from the selected pot according to the rules
    const potIndex = move.selectedPotIndex;
    const stonesToDistribute = newState.playerPots[potIndex];
    newState.playerPots[potIndex] = 0; // Empty the selected pot

    // Distribute the stones to the subsequent pots
    let currentPotIndex = potIndex + 1;
    while (stonesToDistribute > 0) {
        if (currentPotIndex === newState.agentPots.length) {
            // Wrap around to player's pots
            currentPotIndex = 0;
        }
        
        // Distribute one stone to the current pot
        newState.playerPots[currentPotIndex]++;
        stonesToDistribute--;

        currentPotIndex++;
    }

    // Check if the last stone landed in the player's score pit and give an extra turn if needed
    if (currentPotIndex - 1 === 6 && newState.playerPots[currentPotIndex - 1] === 1) {
        newState.extraTurn = true;
    } else {
        newState.extraTurn = false;
    }

    return newState;
}

    function declareWinner() {
        // Determine and print the winner
        if (calculateStones(userScorePit) > calculateStones(oppScorePit)) {
            console.log("Player wins!");
        } else if (calculateStones(userScorePit) < calculateStones(oppScorePit)) {
            console.log("Agent wins!");
        } else {
            console.log("It's a tie!");
        }
    }

});