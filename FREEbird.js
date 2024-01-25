//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird 
let birdWidth = 85; //width/ height ratio = 408/228 = 17/12
let birdHeight = 80; 
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    X : birdX,
    Y : birdY,
    width : birdWidth,
    height : birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0;  // bird jump speed
let gravity = 0.4; 

// game over
let gameOver = false;

//score 
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load Bird Image
    birdImg = new Image();
    birdImg.onload = function(){
       context.drawImage(birdImg, bird.X, bird.Y, bird.width, bird.height);
    }
    birdImg.src = "./onderwerp.png";

    // Load Pipe Images
    topPipeImg = new Image();
    topPipeImg.onload = function() {
        // Now that the top pipe image has loaded, start the game loop
        requestAnimationFrame(update);
    }
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Set up event listeners
    setInterval(placePipes, 1500); // every 1.5seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.X > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // bird
    velocityY += gravity;
    bird.Y += velocityY;
    context.drawImage(birdImg, bird.X, bird.Y, birdWidth, birdHeight);
    if (bird.Y > board.height){
        gameOver = true;
    }

    // Check for game over
    if (gameOver) {
        // Implement game over logic here
        console.log("Game Over!");
    }

    //score 
    context.fillStyle = "white"; // Fill style should be 'fillStyle', not 'fillstyle'
    context.font = "45px sans-serif"; // 'sans-serif' should be 'sans-serif', not 'sans-seriff'
    context.fillText(score, 5, 45); // 'fillText', not 'filltext'

    if (gameOver){
        context.fillText("GAME OVER", 5, 90); // 'fillText', not 'filltext'
    }
}

function placePipes() {
    if(gameOver){
        return;
    }
    let randompipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randompipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    const openingspace = 200;

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randompipeY + pipeHeight + openingspace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.Y = birdY; // 'Y', not 'y'
            pipeArray =[]; // 'pipeArray', not 'pipes'
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){
    return a.X < b.x + b.width &&
           a.X + a.width > b.x  &&
           a.Y < b.y + b.height &&
           a.Y + a.height > b.y;
}
