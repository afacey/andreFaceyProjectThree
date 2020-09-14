// player data ... images taken from https://www.nba.com/raptors/roster
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

const raptorsQuiz = {};

// TODO remove console.logs for project submission

// EXTRAS
// TODO add score reactions

// ===================================================== VARIABLES
raptorsQuiz.playerData = playerData;
raptorsQuiz.questions = [];
raptorsQuiz.currentQuestion = [];
raptorsQuiz.questionCount = raptorsQuiz.playerData.length;
raptorsQuiz.questionsAnswered = 0;
raptorsQuiz.correctAnswers = 0;
raptorsQuiz.instructions = [
  "Each question presents an image of a player, with 4 player names to choose from",
  "Select the player's name, and submit your answer to move on to the next question",
  "Get started by clicking the <em>Start Quiz</em> button below!"
];

// number of names the user can guess from
raptorsQuiz.numOfNameChoices =  4; // custom set number

// check if the amount of players in playerData has the same amount or more names in the list the numOfNameChoices
if (raptorsQuiz.numOfNameChoices >= raptorsQuiz.playerData.length) {
  // if not then set numOfNameChoices to the number of players playerData
  raptorsQuiz.numOfNameChoices = raptorsQuiz.playerData.length;
}

// ===================================================== METHODS

// ------------------------- raptorsQuiz.getRandomIdx -------------------------
raptorsQuiz.getRandomIdx = function(array) {
  const idx = Math.floor(Math.random() * array.length);
  return idx;
}

// ------------------------- raptorsQuiz.generateQuestions -------------------------
raptorsQuiz.generateQuestions = function() {
  // make a copy of the players array
  const generatedQuestions = raptorsQuiz.playerData.slice();

  // for each player object, create new namesToGuessFrom property
  // add the player's name and 3 random player's names to be guessed
  generatedQuestions.forEach((question, idx) => question.namesToGuessFrom = raptorsQuiz.getRandomNameChoices(idx));
    
  // set the raptorsQuiz.questions property to the generatedQuestions generated by this function
  raptorsQuiz.questions = generatedQuestions;
}

// ------------------------- raptorsQuiz.getRandomNameChoices -------------------------
raptorsQuiz.getRandomNameChoices = function(notIdx) {
  // make a copy of the players array
  const players = raptorsQuiz.playerData.slice();
  
  // remove the players name from the copy of the players array and store it for later
  const removedName = players.splice(notIdx, 1)[0].name;
  
  // create an array to hold the player names
  const playerNames = [];
  
  for (let i = 1; i < raptorsQuiz.numOfNameChoices; i++) {
    // get a random index of the functions players array
    const randomIdx = raptorsQuiz.getRandomIdx(players);
    // push name of player at the random index of the players array
    playerNames.push(players[randomIdx].name);
    // remove that name from the players array
    players.splice(randomIdx, 1);
  }

  // get random index of the array + placeholder (3 names + [''] <= to get 4 index options)
  const randomIdx = raptorsQuiz.getRandomIdx(playerNames.concat(['']));

  // add in player's name that was removed in random location in array
  playerNames.splice(randomIdx, 0, removedName);
  
  // return the 3 randomly selected names + player's actual name in random order
  return playerNames; 
}

// ------------------------- raptorsQuiz.getAndDisplayNextQuestion -------------------------
raptorsQuiz.getAndDisplayNextQuestion = function() {
  // get random index to get a random 
  const randomIdx = raptorsQuiz.getRandomIdx(raptorsQuiz.questions);
  
  // splice to remove player out of the player question pool, and store it as the next question
  raptorsQuiz.currentQuestion = raptorsQuiz.questions.splice(randomIdx, 1)[0];
  
  // store raptorsQuiz.currentQuestion into variable
  const player = raptorsQuiz.currentQuestion;

  // Display player's image
  $('.game__playerImg').attr('src', player.imgSrc);

  // Display question count
  $('.game__questionTracker').text(`Question ${raptorsQuiz.questionsAnswered + 1} / ${raptorsQuiz.questionCount}`);
  
  // Remove checked property from previously selected answer
  $('.game__form input[name="player"]:checked').prop("checked", false);

  // Display name options
  $('.game__form label').each(function(idx) {
    const playerName = player.namesToGuessFrom[idx];
    const labelFor = $(this).attr('for');
    
    // Set label text to playerName
    $(this).text(playerName);

    // Set input value to playerName
    $(`#${labelFor}`).attr('value', playerName);

    // Set form button to disabled ... event listener enables button once player selects an answer
    $('.game__form button').attr('disabled', 'disabled');
  })
}

// ------------------------- raptorsQuiz.handleAnswerSubmit -------------------------
raptorsQuiz.handleAnswerSubmit = function(event) {
  // prevent form submission from refreshing page
  event.preventDefault();

  // Get value of the selected answer
  const userAnswer = $('.game__form input[name="player"]:checked').val();
    
  // If userAnswer has a value and its value is not "on" (default "checked" input value if no custom value is set)
  if (userAnswer && userAnswer !== "on") {
    // Increment raptorsQuiz.correctAnswers if the player answered correctly
    if (userAnswer === raptorsQuiz.currentQuestion.name) {
      raptorsQuiz.correctAnswers++;
    }
    
    // Increment questionsAnswered counter
    raptorsQuiz.questionsAnswered++;
    
    // check if all the questions have been answered, if not display the next question
    if (raptorsQuiz.questionsAnswered === raptorsQuiz.questionCount) {
     // if all the questions have been answered, display the results
      raptorsQuiz.displayResults()
  
    } else {
     // get and display the next player
      raptorsQuiz.getAndDisplayNextQuestion();
    }
  }
}

// ------------------------- raptorsQuiz.displayResults -------------------------
raptorsQuiz.displayResults = function() {
  // store .game div as a variable for use later
  const gameContainer = $('.game');

  // game image container
  const imgContainer = $('<div>').addClass('imgContainer');
  
  // Image of the logo taken from https://1000logos.net/toronto-raptors-logo/
  const teamLogoImg = $('<img>').addClass('game__teamLogo').attr('src', './assets/raptorsLogo.png').attr('alt', 'Logo of the Toronto Raptors NBA team');
  
  // append game player image to the image container
  imgContainer.append(teamLogoImg);

  // create div to contain result elements
  const gameResultContainer = $('<div>').addClass('game__resultContainer');

  // result string to display the user's score
  const resultHeading = $('<h2>').addClass("game__result--heading").text("Quiz Finished!");
  const resultScore = $('<p>').addClass("game__result--heading").html(`You answered <span class="game__result--score">${raptorsQuiz.correctAnswers} out of ${raptorsQuiz.questionCount}</span> players correct!`);

  // restart game button for the user to play again
  const restartGameButton = $('<button>').text('Play Again').addClass('button button--startGame');
  
  // button to go to the start screen
  const viewStartScreenButton = $('<button>').text('View Start Screen').addClass('button button--startScreen');

  gameResultContainer.append(resultHeading, resultScore, restartGameButton, viewStartScreenButton);
  
  // empty DOM elements in the gameContainer
  gameContainer.empty();

  // append the resultString in the gameContainer
  gameContainer.append(imgContainer, gameResultContainer);

}

// ------------------------- raptorsQuiz.loadStartingDOM -------------------------
raptorsQuiz.loadStartingDOM = function() {
  // div containing the game DOM elements
  const gameContainer = $('.game');

  // game image container
  const imgContainer = $('<div>').addClass('imgContainer');

  // Image of the logo taken from https://1000logos.net/toronto-raptors-logo/
  const teamLogoImg = $('<img>').addClass('game__teamLogo').attr('src', './assets/raptorsLogo.png').attr('alt', 'Logo of the Toronto Raptors NBA team');
  
  // append game player image to the image container
  imgContainer.append(teamLogoImg);

  // .game__rules div
  const gameRulesContainer = $('<div>').addClass('game__rules');
  const gameRulesHeadline = $('<p>').addClass('game__rulesHeadline').text("Let's see how well you know the players of the 2019-2020 Toronto Raptors!")
  const gameRulesList = $('<ol>').addClass('game__rulesList');
  
  // game rules are stored in raptorsQuiz.instructions
  raptorsQuiz.instructions.forEach(rule => {
    // for each rule create an li and append to the gameRulesList
    const gameRulesListItem = $('<li>').addClass("game__rulesListItem").html(rule);
    gameRulesList.append(gameRulesListItem);
  });

  const startButton = $('<button>').addClass('button button--startGame').text('Start Quiz');

  gameRulesContainer.append(gameRulesHeadline, gameRulesList);

  // Empty contents of the .game div
  gameContainer.empty();

  gameContainer.append(imgContainer, gameRulesContainer, startButton);
}

// ------------------------- raptorsQuiz.loadGameDOM -------------------------
raptorsQuiz.loadGameDOM = function() {
  // div containing the game DOM elements
  const gameContainer = $('.game');

  // Empty contents of the .game div
  gameContainer.empty();

  // game image container
  const imgContainer = $('<div>').addClass('imgContainer');
  // game player image
  const gamePlayerImg = $('<img>').addClass('game__playerImg').attr('alt', 'Toronto Raptors player to be guessed by the user');
  
  // append game player image to the image container
  imgContainer.append(gamePlayerImg);

  // question tracker ... ex. "3 / 14"
  const questionTracker = $('<h3>').addClass('game__questionTracker');

  // game form containing the radio inputs and labels, and submit button
  const gameForm = $('<form>').addClass('game__form');
  const gridContainer = $('<div>').addClass('gridContainer');

  // append four radio inputs and labels to the game form
  for (i = 1; i <= raptorsQuiz.numOfNameChoices; i++) {
    const formControl = $('<div>').addClass('game__formControl');
    const gameInput = $('<input>').addClass('game__input srOnly').attr({type: 'radio', name: 'player', id: `player${i}`});
    const gameInputLabel = $('<label>').addClass('game__inputLabel').attr('for', `player${i}`);
    
    formControl.append(gameInput, gameInputLabel);
    gridContainer.append(formControl);
  }

  // game form submit button
  const gameFormButton = $('<button>').addClass('button button--submit').text('Submit Answer').attr('disabled', 'disabled');

  // append submit button to the game form
  gameForm.append(gridContainer, gameFormButton);

  // append the image container, question tracker, and game form to the game container
  gameContainer.append(imgContainer, questionTracker, gameForm);
}

// ------------------------- raptorsQuiz.setupGameEventListeners -------------------------
raptorsQuiz.setupGameEventListeners = function() {
  const gameContainer = $('.game');

  // start game and play again buttons => click to start game
  gameContainer.on('click', '.button--startGame', raptorsQuiz.startGame);
  
  // start screen button => click loads the start screen dom elements
  gameContainer.on('click', '.button--startScreen', raptorsQuiz.loadStartingDOM);

  // check if a user has selected an answer to enable the form submit button
  gameContainer.on('change', 'input[name="player"]', () => $('.game__form button').prop('disabled', ''));

  // handle user's answer submission
  gameContainer.on('submit', '.game__form', (event) =>  raptorsQuiz.handleAnswerSubmit(event));   
}

// ------------------------- raptorsQuiz.startGame -------------------------
raptorsQuiz.startGame = function() {
  // set questions answered to 0
  raptorsQuiz.questionsAnswered = 0;

  // set questions answered correctly to 0
  raptorsQuiz.correctAnswers = 0;

  // populate the question in the game object
  raptorsQuiz.generateQuestions();

  // load game DOM elements  
  raptorsQuiz.loadGameDOM();

  // get and display the next question
  raptorsQuiz.getAndDisplayNextQuestion();
}

// ------------------------- raptorsQuiz.init -------------------------
raptorsQuiz.init = function() {  
  // load DOM elements of the start page
  raptorsQuiz.loadStartingDOM();
  
  // setup the event listeners of the game
  raptorsQuiz.setupGameEventListeners();
}

// ===================================================== DOCUMENT READY
$(function() {
  raptorsQuiz.init();
});