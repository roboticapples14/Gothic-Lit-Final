var canvas;
var ctx;

//image choices
var playerImg1 = new Image();
playerImg1.src = "./Assets/Mas/knight.gif";
var playerImg2 = new Image();
playerImg2.src = "./Assets/Mas/scary man.gif"
var selector = new Image();
selector.src = "./Assets/Mas/triangle.png";

var intervalId;
var gameID;

var player1X, player1Y;
player1X = 75;
player1Y = 100;
var player2X, player2Y;
player2X = 375;
player2Y = 110;
var selectorX, selectorY;
selectorX = player1X + 100;
selectorY = 310;

var playerImg = new Image();
var opponentImg = new Image();
opponentImg.src = "./Assets/Mas/blooddrop.png";
var cannonImg = new Image();
cannonImg.src = "./Assets/Mas/garlic.png";
var background = new Image();
background.src = "./Assets/Mas/cathedral.jpeg";

var backgroundX, backgroundY;
backgroundX = backgroundY = 0;
var backgroundSpeed = 2;

var x, y, width, height;
x = 150;
y = 150;
height = 100;
width = 100;
var speed = 10;

var badX, badY, badWidth, badHeight;
badX = 0;
badY = 0;
badWidth = 70;
badHeight = 85;
var badSpeed = 4;

var cannonX, cannonY;
cannonX = cannonY = 0;
var cannonSize = 60;
var cannonCoolDown = 0;
var cannonCoolDownDelay = 20;
var cannonSpeed = 5;

var score = -10;
var win = false;

var keys = [];

function menu() {
    canvas = document.getElementById("gc");
    ctx = canvas.getContext("2d");

    intervalId = window.setInterval(menuUpdate, 1000/ 30);
}

function menuUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(29, 124, 172, 0.7)";
    ctx.font = "60px Arial";
    ctx.fillText("Choose your player: ", 240, 70, 200);

    ctx.drawImage(playerImg1, player1X, player1Y, width * 2, height * 2);
    ctx.drawImage(playerImg2, player2X, player2Y, width * 1.8, height * 2);

    ctx.drawImage(selector, selectorX, selectorY, 30, 30);

    window.onkeydown = checkKeyMenu;

}

function checkKeyMenu(e) {
    e = e || window.event;
    if (e.keyCode == '39') {
        // right arrow
        selectorX = player2X + width;
     }
    else if (e.keyCode == '37') {
        // left arrow
        selectorX = player1X + width;
    }
    else if (e.keyCode == '13') {
        //enter
        if (selectorX == player2X + width) {
            //player 1 selected
            playerImg.src = playerImg2.src;
        }
        else if (selectorX == player1X + width) {
            //player 2 selected
            playerImg.src = playerImg1.src;
        }

        window.clearInterval(intervalId);
        startGame();
    }
}

function startGame() {
    var fps = 1000/ 30;
    gameID = window.setInterval(update, fps);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (win == false) {
        moveGoodGuy()
        handleCannon();
        moveBadGuy()

        if (checkCollisions(width - 28, height - 28, x, y, badWidth - 10, badHeight - 10, badX, badY)) {
            repositionBadGuy()
            score += 5;
        }
        if (checkCollisions(cannonSize, cannonSize, cannonX, cannonY, badWidth - 10, badHeight - 10, badX, badY)) {
            repositionBadGuy()
            score += 10;
        }
    }
    drawScore();


    checkWin();
}

function moveGoodGuy() {
    /*ctx.fillStyle = "blue";
    ctx.fillRect(x, y, height, width);*/
    ctx.drawImage(playerImg, x, y, width, height);

    window.onkeydown = function (event) {
        keys[event.key] = true;
    };
    
    window.onkeyup = function (event) {
        keys[event.key] = false;
    };

    if (keys["ArrowRight"] == true) {
        x += speed;
        if (x > canvas.width - width + 20) {
            x = canvas.width - width + 20;
        }
    }
    if (keys["ArrowLeft"] == true) {
        x -= speed;
        if (x < 0 - (width * .8)) {
            x = 0 - (width * .8);
        }
    }
    if (keys["ArrowUp"] == true) {
        y -= speed;
        if (y < 0 - 12) {
            y = 0 - 12;
        }
    }
    if (keys["ArrowDown"] == true) {
        y += speed;
        if (y > canvas.height - (height - 5)) {
            y = canvas.height - (height - 5);
        }
    }
}

function moveBadGuy() {
    /*ctx.fillStyle = "red";
    ctx.fillRect(badX, badY, badHeight, badWidth);*/

    ctx.drawImage(opponentImg, badX, badY, badWidth, badHeight);


    //BadGuy Controls
    badY += badSpeed;
    if (badY > 300) {
        repositionBadGuy()
        score -= 10
    }
}

function repositionBadGuy() {
    badY = -10;
    badX = Math.random() * (canvas.width - badWidth);
}

function checkCollisions(rect1Width, rect1Height, rect1XPos, rect1YPos,
    rect2Width, rect2Height, rect2XPos, rect2YPos) {
    if (rect1XPos < rect2XPos + rect2Width &&
        rect1XPos + rect1Width > rect2XPos &&
        rect1YPos < rect2YPos + rect2Height &&
        rect1Height + rect1YPos > rect2YPos) {
        return true;
    } else {
        return false
    }
}

function handleCannon() {
    if (keys[" "] && cannonCoolDown <= 0) {
        cannonX = x + width / 2 - cannonSize / 2;
        cannonY = y;
        cannonCoolDown = cannonCoolDownDelay;
    }
    cannonCoolDown--;
    cannonY -= cannonSpeed;

    ctx.drawImage(cannonImg, cannonX, cannonY, cannonSize, cannonSize);
}

function drawScore() {
    ctx.fillStyle = "rgba(29, 124, 172, .7)";
    ctx.font = "Arial 10px";
    ctx.fillText("Score: " + score, 10, 50, 100);
}

function drawBackground() {
    if (backgroundX < -canvas.width)
        backgroundX = 0;

    backgroundX -= backgroundSpeed;
    ctx.drawImage(background, backgroundX, backgroundY,
        canvas.width, canvas.height);
    ctx.drawImage(background, backgroundX + canvas.width, backgroundY,
        canvas.width, canvas.height);
}

function checkWin() {
    if (score >= 100) {
        win = true;
        playerImg.src = "";
        opponentImg.src = "";
        cannonImg.src = "";

        ctx.fillStyle = "rgba(29, 124, 172, .7)";
        ctx.font = "Arial 200px";
        ctx.fillText("You Win!", 195, 200);
    }
}