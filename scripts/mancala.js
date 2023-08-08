document.addEventListener('DOMContentLoaded', () => {
    const startbutton = document.getElementById("start");
    let scoreboard = document.getElementById("scoreboard");
    let score = 0;
    scoreboard.innerHTML = "Score: "+score;

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
      ]; //we defined the array here so that the stones go in the order we want them to
    let userScorePit = document.getElementById('upit'); // User's score pit
    let oppScorePit = document.getElementById('opppit'); //Opponent's Score pit
    var playing = false;

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

    pots.forEach(pot => {
        pot.addEventListener('click', () => {
          if (playing) {
            distributeStones(pot); // Call the distributeStones function when a pot is clicked
          }
        });
      });
    
    function distributeStones(clickedPot) {
    const circleContainers = clickedPot.querySelectorAll('.circle-container');
    const totalStones = calculateStones(clickedPot); // Calculate the number of stones

    if (totalStones === 0) {
        return; // No stones to distribute
    }
    
    circleContainers.forEach(container => {
        const circles = container.querySelectorAll('.circle');
    
        circles.forEach((circle, index) => {
        setTimeout(() => {
            const targetPotIndex = (Array.from(pots).indexOf(clickedPot) + index + 1) % pots.length;
            const targetPot = pots[targetPotIndex];
            const targetContainer = targetPot.querySelector('.circle-container'); // Get the target container
    
            if (targetPot === userScorePit) {
                userScorePit.appendChild(circle); // Append the stone to the user's score pit
              } else {
                targetContainer.appendChild(circle); // Append the stone to the target container
              }

        }, index * 500); // Adjust the delay between stone movements
        });
    });
    }
    
//function returns number of stones in a pot
    function calculateStones(pot) {
        const stones = pot.querySelectorAll('.circle');
        return stones.length;
    }
});





