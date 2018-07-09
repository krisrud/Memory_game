let table = document.getElementsByClassName("deck")[0];
let cells = document.querySelectorAll(".deck li");
let container = document.getElementsByClassName("container")[0];
let scorePanel = document.getElementsByClassName("score-panel")[0];
let repeat = document.getElementsByClassName("fa fa-repeat")[0];
let timeText;


let openCards = [];
let openChildCards = [];
let cardNames = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor",
    "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle",
    "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

let matchPairs = 0;
let starsCount = 3;
let countCard = 0;
let moves = 0;
let winMoves;

let currentTime;
let startTime = new Date();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function cardShuffle() {
    let array = shuffle(cardNames);
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    let i;
    for (i = 0; i < array.length; i++) {
        let outerCell = document.createElement("li");
        outerCell.className = "card";
        table.appendChild(outerCell);
        let innerCell = document.createElement("i");
        innerCell.className = array[i];
        outerCell.appendChild(innerCell);
    }
}


function timer() {
    let timeDiv = document.createElement("div");
    scorePanel.appendChild(timeDiv);
    timeText = document.createTextNode("");
    timeDiv.appendChild(timeText);
}

/* Open cards
*/
function openCard(event) {
    let target = event.target;
    if (event.target.className === "card") {
        target.classList.add("open", "show");
    }
    if (event.target.className === "card open show") {
        target.animate([
            // keyframes
            {transform: 'translateX(0px)'},
            {transform: 'translateX(-25px)'},
            {transform: 'translateX(25px)'}
        ], {
            // timing options
            duration: 500,
            iterations: 1
        });
    }
}

/* Close cards, reset variables
*/
function newGame(cells) {
    let i;
    for (i = 0; i < cells.length; i++) {
        cells[i].classList.remove("match", "open", "show");
    }

    cardShuffle();

    document.getElementsByClassName("moves")[0].textContent = "0";
    moves = 0;
    matchPairs = 0;
    countCard = 0;
    startTime = new Date();
    starsCount = 3;

}


setInterval(function () {
    currentTime = Math.floor((new Date() - startTime) / 1000);
    timeText.textContent = currentTime  + " sec";
}, 1000);



timer();
newGame(cells);




//compare cards
function logic() {
    if (countCard === 2) {
        if (openChildCards[0] === openChildCards[1]) {
            openCards[0].classList.remove("open");
            openCards[0].classList.remove("show");
            openCards[0].classList.add("match");
            openCards[1].classList.remove("open");
            openCards[1].classList.remove("show");
            openCards[1].classList.add("match");
            matchPairs++;
            countCard = 0;
            openCards = [];
            openChildCards = [];
        } else {
            setTimeout(function () {
                let i;
                for (i = 0; i < openChildCards.length; i++) {
                    openCards[i].classList.remove("open", "show");
                }
                countCard = 0;
                openCards = [];
                openChildCards = [];
            }, 500);
        }
        if (matchPairs === 8) {
            deleteAll();
            win();
        }
    }
}

function win() {
    let time = new Date() - startTime;
    let myHead = document.createElement("h1");
    let headText = document.createTextNode("Congratulations!");
    myHead.appendChild(headText);
    container.appendChild(myHead);
    let myDiv = document.createElement("div");
    container.appendChild(myDiv);
    let i;
    for (i=0; i<starsCount; i++) {
        let iStar = document.createElement("i");
        iStar.className = "fa fa-star";
        myDiv.appendChild(iStar);
    }
    let myPar = document.createElement("p");
    let parText = document.createTextNode("You win! Your moves: " + winMoves);
    myPar.appendChild(parText);
    container.appendChild(myPar);
    let myPar2 = document.createElement("p");
    let parText2 = document.createTextNode("Your time: " + time/1000 + " seconds." +  "  Wanna play again?");
    myPar2.appendChild(parText2);
    container.appendChild(myPar2);
}

//game logic
table.onclick = function (event) {
    let z = event.target;
    if (event.target.className.indexOf("fa") !== -1) {
        z = event.target.parentNode;
    }
    if (z.className !== "card open show"  && z.className !== "deck") {
        countMoves();
        openCard(event);
        openCards.push(event.target);
        openChildCards.push(event.target.querySelector(".card i").className);
        countCard++;
        logic();
    }

};

//count moves
function countMoves() {
    moves++;
    if (moves % 2 == 0) {
        document.getElementsByClassName("moves")[0].textContent = moves / 2;
        winMoves = moves / 2;
    }
    if (moves === 20 || moves === 25) {
        let stars = document.getElementsByClassName("stars")[0];
        stars.removeChild(document.getElementsByClassName("fa fa-star")[0].parentNode);
        starsCount--;
        console.log(starsCount);
    }
}

repeat.onclick = function (event) {
    newGame(cells);
};

function deleteAll() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}
