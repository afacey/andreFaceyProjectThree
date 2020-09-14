// player data
// images taken from https://www.nba.com/raptors/roster
const playerData = [
  { name: "Chris Boucher", imgSrc: "./assets/chrisBoucher.png" },
  { name: "Dewan Hernandez", imgSrc: "./assets/dewanHernandez.png"},
  { name: "Fred VanVleet", imgSrc: "./assets/fredVanvleet.png"},
  { name: "Kyle Lowry", imgSrc: "./assets/kyleLowry.png" },
  // { name: "Malcolm Miller", imgSrc: "./assets/malcolmMiller.png" },
  // { name: "Marc Gasol", imgSrc: "./assets/marcGasol.png" },
  // { name: "Matt Thomas", imgSrc: "./assets/mattThomas.png" },
  // { name: "Norman Powell", imgSrc: "./assets/normanPowell.png"},
  // { name: "OG Anunoby", imgSrc: "./assets/ogAnunoby.png" },
  // { name: "Oshae Brissett", imgSrc: "./assets/oshaeBrissett.png" },
  // { name: "Pascal Siakam", imgSrc: "./assets/pascalSiakam.png"},
  // { name: "Patrick McCaw", imgSrc: "./assets/patrickMccaw.png" },
  // { name: "Rondae Hollis-Jefferson", imgSrc: "./assets/rondaeHollisJefferson.png" },
  // { name: "Serge Ibaka", imgSrc: "./assets/sergeIbaka.png" },
  // { name: "Stanley Johnson", imgSrc: "./assets/stanleyJohnson.png" },
  // { name: "Terence Davis", imgSrc: "./assets/terenceDavis.png"}
]

const game = {};

// TODO create method for checking if answer is correct
// TODO look into combining / renaming some methods
// TODO clean up methods ... try to reduce repeated code
// TODO organize methods where it makes it more readable
// TODO remove console.logs for project submission

// EXTRAS
// TODO add score reactions

// ===================================================== VARIABLES
game.gameState = false;
game.players = playerData;
game.questions = [];
game.currentQuestion = [];
game.questionCount = game.players.length;
game.questionsAnswered = 0;
game.correctAnswers = 0;
// game.highScore = 0;

// number of names the user can guess from
game.numOfNameChoices =  4; // custom set number

// check if players object has the same or more names in the list
// if not then set number of names to the to the number of players in the object (length of player object)
if (game.numOfNameChoices >= game.players.length) {
  game.numOfNameChoices = game.players.length;
}

// ===================================================== METHODS


// ------------------------- game.loadGameDOM -------------------------
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
  for (i = 1; i <= game.numOfNameChoices; i++) {
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

// ------------------------- game.getRandomIdx -------------------------
game.getRandomIdx = function(array) {
  const idx = Math.floor(Math.random() * array.length);
  return idx;
}

// ------------------------- game.getRandomNames -------------------------
game.getRandomNames = function(notIdx) {
  // make a copy of the players array
  const players = game.players.slice();
  
  // remove the players name from the copy of the players array and store it for later
  const removedName = players.splice(notIdx, 1)[0].name;
  
  // create an array to hold the player names
  const playerNames = [];
  
  for (let i = 1; i < game.numOfNameChoices; i++) {
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

// ------------------------- game.populateQuestions -------------------------
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

// ------------------------- game.displayResults -------------------------
game.displayResults = function() {
  // Set game state to off (false)
  gameState = false;

  // store .game div as a variable for use later
  const gameContainer = $('.game');

  const gameResultContainer = $('<div>').addClass('game__resultContainer');

  // result string to display the user's score
  const resultHeading = $('<h2>').addClass("game__result--heading").text("Quiz Finished!");
  const resultScore = $('<p>').addClass("game__result--heading").html(`You answered <span class="game__result--score">${game.correctAnswers} out of ${game.questionCount}</span> players correct!`);

  // TODO add highscore ?
  // const highScore = $('<p>').addClass("game__result--highScore");

  // if (game.correctAnswers > game.highScore) {
  //   game.highScore = game.correctAnswers;
  //   highScore.text(`New high score with ${game.correctAnswers} correct player(s)!`);
  // } 
  // else if (game.correctAnswers !== 0 && game.correctAnswers === game.highScore) {
  //   highScore.text(`You tied the high score with ${game.correctAnswers} correct player(s)!`);
  // }
  // else if (game.highScore !== 0) {
  //   highScore.text(`Current high score is ${game.highScore} correct player(s)!`);
  // }
  // else {
  //   highScore.text(`No high score has been set yet!`);
  // }

  // button to go to the start screen
  const startScreenButton = $('<button>').text('Start Screen').addClass('game__button').on('click', game.loadStartingDOM);
  
  // reset button for the user to play again
  // on click run the resetGame method
  const resetButton = $('<button>').text('Play Again').addClass('game__button').on('click', game.resetGame);

  gameResultContainer.append(resultHeading, resultScore, resetButton, startScreenButton);
  
  // empty DOM elements in the gameContainer
  gameContainer.empty();

  // append the resultString in the gameContainer
  gameContainer.append(gameResultContainer);

}



// ------------------------- game.setGameEventListeners -------------------------

// Setup the event listeners for the game DOM elements after they have been loaded
game.setGameEventListeners = function() {

  // check if a user has selected an answer to enable the form submit button
  game.userAnwsers = $('.game__form input[name="player"]').on('change', function() {
    $('.game__form button').prop('disabled', '')
  });
  
  game.handleSubmit = $('.game__form').on('submit', function(evt) {
    evt.preventDefault();
    
    // check the user's answer against correct answer
    game.checkUserAnswer();
    
    // check if all the questions have been answered, if not display the next question
    if (game.questionsAnswered === game.questionCount) {
      // if all the questions have been answered, display the results
      game.displayResults()
      
    } else {
      // get and display the next player
      console.log('on submit')
      game.getAndDisplayNextPlayer();
    }
  });
}

// ------------------------- game.loadStartingDOM -------------------------
game.loadStartingDOM = function() {
  // div containing the game DOM elements
  const gameContainer = $('.game');

  // Empty contents of the .game div
  gameContainer.empty();

  // game image container
  const imgContainer = $('<div>').addClass('imgContainer');
  // game player image
  // Image of the logo taken from https://1000logos.net/toronto-raptors-logo/
  const teamLogoImg = $('<img>').addClass('game__teamLogo').attr('src', './assets/raptorsLogo.png').attr('alt', 'Logo of the Toronto Raptors NBA team');
  
  // append game player image to the image container
  imgContainer.append(teamLogoImg);

  // .game__rules div
  const gameRulesContainer = $('<div>').addClass('game__rules');
  const gameRulesHeadline = $('<p>').addClass('game__rulesHeadline').text("Let's see how well you know the players of the 2019-2020 Toronto Raptors!")
  const gameRulesList = $('<ol>').addClass('game__rulesList');
  const gameRulesListItems = `<li class="game__rulesListItem">Each question presents an image of a player, with 4 player names to choose from</li>
  <li class="game__rulesListItem">Select the player's name, and submit your answer to move on to the next question</li>
  <li class="game__rulesListItem">Get started by clicking the <em>Start Quiz</em> button below!</li>`;

  gameRulesList.html(gameRulesListItems);


  const startButton = $('<button>').addClass('game__button').text('Start Quiz').on('click', game.resetGame);

  gameRulesContainer.append(gameRulesHeadline, gameRulesList);

  gameContainer.append(imgContainer, gameRulesContainer, startButton);
}

// ------------------------- game.startGame -------------------------
game.startGame = function() {
  // load game DOM elements  
  game.loadGameDOM();

  // get and display the next question
  console.log('on start game');
  game.getAndDisplayNextPlayer();
  
  // Set Game DOM Event Listeners
  game.setGameEventListeners();

  // Start Game
  gameState = true;
}

// ------------------------- game.resetGame -------------------------
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

// ------------------------- game.init -------------------------
game.init = function() {
  // populate the question in the game container
  game.populateQuestions();
  
  // load DOM elements of the start page
  game.loadStartingDOM();
}

// ------------------------- game.checkUserAnswer -------------------------

game.checkUserAnswer = function() {
  // Get value of the selected answer
  const userAnswer = $('.game__form input[name="player"]:checked').val();
    
  // If userAnswer has a value and its value is not "on" (default "checked" input value if no custom value is set)
  if (userAnswer && userAnswer !== "on") {
    // Increment game.correctAnswers if the player answered correctly
    if (userAnswer === game.currentQuestion.name) {
      game.correctAnswers++;
    }
    
    // Increment questionsAnswered counter
    game.questionsAnswered++;
  }
}

// ------------------------- game.getAndDisplayNextQuestion -------------------------

game.getAndDisplayNextPlayer = function() {
  // get random index to get a random 
  const randomIdx = game.getRandomIdx(game.questions);
  
  // splice to remove player out of the player question pool, and store it as the next question
  game.currentQuestion = game.questions.splice(randomIdx, 1)[0];

  console.table('questions',game.questions);
  console.table('current ques', game.currentQuestion);
  
  // store game.currentQuestion into variable
  const player = game.currentQuestion;

  // Display player's image
  $('.game__playerImg').attr('src', player.imgSrc);

  // Display question count
  $('.game__questionTracker').text(`Question ${game.questionsAnswered + 1} / ${game.questionCount}`);
  
  // Remove checked property from previously selected answer
  $('.game__form input[name="player"]:checked').prop("checked", false);

  // Display name options
  $('.game__form label').each(function(idx) {
    const playerName = player.gameNames[idx];
    const labelFor = $(this).attr('for');
    
    // Set label text to playerName
    $(this).text(playerName);

    // Set input value to playerName
    $(`#${labelFor}`).attr('value', playerName);

    // Set form button to disabled ... event listener enables button once player selects an answer
    $('.game__form button').attr('disabled', 'disabled');
  })
}

// ===================================================== DOCUMENT READY
$(function() {
  game.init();
  
});