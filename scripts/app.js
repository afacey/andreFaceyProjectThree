// player data
const playerData = [
  { name: "Chris Boucher", imgSrc: "../assets/chrisBoucher.png" },
  { name: "Dewan Hernandez", imgSrc: "../assets/dewanHernandez.png"},
  { name: "Fred VanVleet", imgSrc: "../assets/fredVanvleet.png"},
  { name: "Kyle Lowry", imgSrc: "../assets/kyleLowry.png" },
  // { name: "Malcolm Miller", imgSrc: "../assets/malcolmMiller.png" },
  // { name: "Matt Thomas", imgSrc: "../assets/mattThomas.png" },
  // { name: "Norman Powell", imgSrc: "../assets/normanPowell.png"},
  // { name: "OG Anunoby", imgSrc: "../assets/ogAnunoby.png" },
  // { name: "Pascal Siakam", imgSrc: "../assets/pascalSiakam.png"},
  // { name: "Patrick McCaw", imgSrc: "../assets/patrickMccaw.png" },
  // { name: "Rondae Hollis-Jefferson", imgSrc: "../assets/rondaeHollisJefferson.png" },
  // { name: "Serge Ibaka", imgSrc: "../assets/sergeIbaka.png" },
  // { name: "Stanley Johnson", imgSrc: "../assets/stanleyJohnson.png" },
  // { name: "Terence Davis", imgSrc: "../assets/terenceDavis.png"}
]

const game = {};

// ===================================================== VARIABLES
game.gameState = false;
game.players = playerData;
game.questions = [];
game.currentQuestion = [];
game.questionCount = game.players.length;
game.questionsAnswered = 0;
game.correctAnswers = 0;
game.highScore = 0;

// number of names the user can guess from
game.numOfGuessNames =  4; // custom set number

// check if players object has the same or more names in the list
// if not then set number of names to the to the number of players in the object (length of player object)
game.numOfGuessNames = game.players.length >= game.numOfGuessNames ? game.numOfGuessNames : game.players.length; 

// ===================================================== METHODS
game.init = function() {
  game.handleStart = $('.game__button').on('click', game.startGame);
  // populate the question in the game container
  console.log("populating questions");
  game.populateQuestions();
}

game.startGame = function() {
  
  // fetch the next question
  game.getNextQuestion();

  game.loadGameDOM();

  console.log("Displaying next question");
  game.displayQuestion();
  
  // Set Game DOM Event Listeners
  game.setGameEventListeners();

  // Start Game
  gameState = true;
}

game.resetGame = function() {
  // reset questions answered to 0
  game.questionsAnswered = 0;

  // reset questions answered correctly to 0
  game.correctAnswers = 0;

  // call populateQuestions method to populate questions array
  game.populateQuestions();

  // call startGame method to reload the game DOM elements and display the next question
  game.startGame();
}

game.loadGameDOM = function() {
  // div containing the game DOM elements
  const gameContainer = $('.game');

  // Empty contents of the .game div
  gameContainer.empty();

  // game image container
  const imgContainer = $('<div>').addClass('imgContainer');
  // game player image
  const gamePlayerImg = $('<img>').addClass('game__playerImg')
            .attr('alt', 'Toronto Raptors player to be guessed by the user');
  
  // append game player image to the image container
  imgContainer.append(gamePlayerImg);

  // question tracker ... ex. "3 / 14"
  const questionTracker = $('<h3>').addClass('game__questionTracker');

  // game form containing the radio inputs and labels, and submit button
  const gameForm = $('<form>').addClass('game__form');
  const gridContainer = $('<div>').addClass('gridContainer');

  // append four radio inputs and labels to the game form
  for (i = 1; i <= game.numOfGuessNames; i++) {
    const formControl = `
      <div class="game__formControl">
        <input class="game__input srOnly" type="radio" name="player" id="player${i}" />
        <label class="game__inputLabel" for="player${i}">Player ${i}</label>
      </div>
      `;

    gridContainer.append(formControl);
  }

  // game form submit button
  const gameFormButton = $('<button>').addClass('game__button game__button--submit').text('Submit Answer').attr('disabled', 'disabled');

  // append submit button to the game form
  gameForm.append(gridContainer, gameFormButton);

  // append the image container, question tracker, and game form to the game container
  gameContainer.append(imgContainer, questionTracker, gameForm);
}

game.getRandomIdx = function(array) {
  const idx = Math.floor(Math.random() * array.length);
  return idx;
}


game.getRandomNames = function(notIdx) {
  // make a copy of the players array
  const players = game.players.slice();
  
  // remove the players name from the copy of the players array and store it for later
  const removedName = players.splice(notIdx, 1)[0].name;
  
  // create an array to hold the player names
  const playerNames = [];
  
  for (let i = 1; i < game.numOfGuessNames; i++) {
    // get a random index of the functions players array
    const randomIdx = game.getRandomIdx(players);
    // push name of player at the random index of the players array
    playerNames.push(players[randomIdx].name);
    // remove that name from the players array
    players.splice(randomIdx, 1);
  }

  // get random index of the array + placeholder (3 names + [''] <= to get 4 index options)
  const randomIdx = game.getRandomIdx(playerNames.concat(['']));

  // add in player's name that was removed in random location in array
  playerNames.splice(randomIdx, 0, removedName);
  
  // return the 3 randomly selected names + player's actual name in random order
  return playerNames; 
}

game.populateQuestions = function() {
  // make a copy of the players array
  const questions = game.players.slice();

  questions.forEach(function(question, idx) {
    // for each player object, create new gameNames property
    // add the player's name and 3 random player's names to be guessed
    // question.gameNames = [question.name].concat(game.getRandomNames(idx));
    question.gameNames = game.getRandomNames(idx);
  })

  // set the game.questions property to the questions generated by this function
  game.questions = questions;
}

game.displayQuestion = function() {
  const question = game.currentQuestion;
  // Display player's image
  $('.game__playerImg').attr('src', question.imgSrc);

  // Display question count
  $('.game__questionTracker').text(`Question ${game.questionsAnswered + 1} / ${game.questionCount}`);
  
  // Remove checked property from previously selected answer
  $('.game__form input[name="player"]:checked').prop("checked", false);

  // Display name options
  $('.game__form label').each(function(idx) {
    const playerName = question.gameNames[idx];
    const labelFor = $(this).attr('for');
    
    // Set label text to playerName
    $(this).text(playerName);

    // Set input value to playerName
    $(`#${labelFor}`).attr('value', playerName);

    // Set form button to disabled ... event listener enables button once player selects an answer
    $('.game__form button').attr('disabled', 'disabled');
  })
}

game.getNextQuestion = function() {
  const randomIdx = game.getRandomIdx(game.questions);
  
  // splice to remove question out of the pool, and store it as the next question
  game.currentQuestion = game.questions.splice(randomIdx, 1)[0];
}

game.displayResults = function() {
  // Set game state to off (false)
  gameState = false;

  // store .game div as a variable for use later
  const gameContainer = $('.game');

  const gameResultContainer = $('<div>').addClass('game__resultContainer');

  // reset button for the user to play again
  const resetButton = $('<button>').text('Play Again').addClass('game__button')
                        // on click run the resetGame method
                        .on('click', game.resetGame);

  // result string to display the user's score
  let resultString = 
        `
        <h2 class="game__result--heading">Quiz Finished!</h2>
        <p class="game__result--score">
        You got ${game.correctAnswers} / ${game.questionCount} correct!
        </p>
        `;
  
  if (game.correctAnswers > game.highScore) {
    game.highScore = game.correctAnswers;
    resultString += (`New high score with ${game.correctAnswers} correct answer(s)!`);
  } 
  else if (game.correctAnswers !== 0 && game.correctAnswers === game.highScore) {
    resultString += (`You tied the high score with ${game.correctAnswers} correct answer(s)!`);
  }
  else if (game.highScore !== 0) {
    resultString += (`Current high score is ${game.highScore} correct answer(s)!`);
  }

  gameResultContainer.append(resultString, resetButton);
  
  // empty DOM elements in the gameContainer
  gameContainer.empty();

  // append the resultString in the gameContainer
  gameContainer.append(gameResultContainer);

}

// Setup the event listeners for the game DOM elements after they have been loaded
game.setGameEventListeners = function() {

  // check if a user has selected an answer to enable the form submit button
  game.userAnwsers = $('.game__form input[name="player"]').on('change', function() {
    $('.game__form button').prop('disabled', '')
  });
  
  // check the user's answer against correct answer
  // check if all the questions have been answered, if not display the next question
  game.handleSubmit = $('.game__form').on('submit', function(evt) {
    evt.preventDefault();
  
    // Get value of the selected answer
    const userAnswer = $('.game__form input[name="player"]:checked').val();
    
    // If userAnswer has a value and its value is not "on"
    if (userAnswer && userAnswer !== "on") {
      console.log('user answer:', userAnswer);
      console.log('correct answer: ', game.currentQuestion.name)

      // Increment game.correctAnswers if the player answered correctly
      userAnswer === game.currentQuestion.name && game.correctAnswers++;
      
      // Increment questionsAnswered counter
      game.questionsAnswered++;
  
      // check if the amount of questions answered is the amount of questions in the game 
      if (game.questionsAnswered === game.questionCount) {
        console.log("game finished!")
    
        // if all the questions have been answered, display the results
        game.displayResults()
        
      } else {
        // Get next question
        game.getNextQuestion();
        // Display the next question
        game.displayQuestion();
      }
  
  
    }
    //  else {
    //   console.log('question must be answered to move forward')
    // }
  });
}


// ===================================================== DOCUMENT READY
$(function() {
  game.init();
  
});