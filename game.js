//Select canvas element
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

//Add border to canvas
cvs.style.border = "1px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

//Games variables and constants
const paddle_width = 100;
const paddle_margin_bottom = 50;
const paddle_height = 20;
const ball_radius = 10;
let life = 3; //player has 3 life
let score = 0;
let level = 1;
const max_level = 5;
let leftArrow = false;
let rightArrow = false;
let game_over = false;

//creating the paddle
const paddle = {
x : cvs.width/2 - paddle_width/2,
y : cvs.height - paddle_margin_bottom - paddle_height,
width : paddle_width,
height : paddle_height,
dx : 5
}

//draw the paddle
function drawPaddle(){
    ctx.fillStyle = "#171010";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#CD113B";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//Control our paddle
//When we press the key
document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
});

//When we release the key
document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
});

//Move the paddle
function movePaddle(){
    if(rightArrow && paddle.x + paddle_width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

//create the ball
const ball = {
    x : cvs.width/2,
    y : paddle.y - ball_radius,
    radius : ball_radius,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

//draw the ball
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#CD113B";
    ctx.fill();

    ctx.strokeStyle = "#171010";
    ctx.stroke();

    ctx.closePath();
}

//Move the ball
function moveBall(){
    ball.x +=ball.dx;
    ball.y +=ball.dy;
}

//Ball and wall collision detection
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx =- ball.dx;
        wall_hit.play();
    }
    if(ball.y - ball.radius < 0){
        ball.dy =- ball.dy;
        wall_hit.play();
    }
    if(ball.y + ball.radius > cvs.height){
        life--; //when hit the ground the user looses a life
        lost.play(); //play sound
        resetBall(); //reset the game
    }
}

//Reset the ball 
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - ball_radius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//Ball and the paddle collisison
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && 
        paddle.y < paddle.y + paddle.height && ball.y > paddle.y){

            //play sound
            paddlehit.play();
           
            //checking where the ball hit the paddle
            let collidePoint = ball.x - (paddle.x + paddle.width/2);

            //normalize the values
            collidePoint = collidePoint / (paddle.width/2);

            //calculate the angle of the ball
            let angle = collidePoint * Math.PI/3;
           
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
        }
}

//create the bricks
const brick = {
    row : 2,
    column : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    OffSetTop : 20, 
    marginTop : 40,
    fillColor : "#171010",
    strokeColor : "#FDF6F0"
}

//create the bricks
let bricks = [];
function createBricks(){
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y : r * (brick.OffSetTop + brick.height) + brick.OffSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

//draw the bricks
function drawBricks(){
    for (let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            //if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

//Ball brick collision
function ballBrickCollision(){
    for (let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            //if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width
                && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                   brickhitting.play();
                    ball.dy = -ball.dy;
                    b.status = false; // the brick is broken
                    score += 10;
                }
            }
        }
    }
}

//Show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    //draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

    //draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

//draw function
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();

    //show score 
    showGameStats(score, 35, 25, score_img, 5, 5);
    //show lives
    showGameStats(life, cvs.width - 25, 25, life_img, cvs.width - 55, 5);
    //show level
    showGameStats(level, cvs.width/2, 25, level_img, cvs.width/2 - 30, 5);
}

//game over function
function gameOver(){
    if(life <= 0){
        showYouLose();
        game_over = true;
    }
}

//level up
function levelUp(){
    let levelDone = true;

    //check if all the brickes are brocken
    for (let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            levelDone = levelDone && ! bricks[r][c].status;
        }
    }
    if(levelDone){
        win_sound.play();
        if(level >= max_level){
            showYouWin();
            game_over = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
    }
}

//update game function
function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
}

//Game loop function
function loop(){
    //clear the canvas
    ctx.drawImage(back_img, 0, 0);
    draw();
    update();
    if(! game_over){
        requestAnimationFrame(loop);
    }
}
loop();

//select sound element
const soundElement = document.getElementById("sound");
soundElement.addEventListener("click", audioManager);

function audioManager(){
    //change the image according to sound on or off
    let imgSrc = soundElement.getAttribute("src");
    let sound_img = imgSrc == "SOUND_ON.png" ? "SOUND_OFF.png" : "SOUND_ON.png";

    soundElement.setAttribute("src", sound_img);

    //mute and unmute sounds
    wall_hit.muted = wall_hit.muted ? false : true;
    paddlehit.muted = paddlehit.muted ? false : true;
    win_sound.muted =win_sound.muted ? false : true;
    lost.muted = lost.muted ? false : true;
    brickhitting.muted = brickhitting.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
