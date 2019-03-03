"use strict";

// tengja við canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// setja stærðina á canvasinu
var width = canvas.width = 480;
var height = canvas.height = 320;

// bakgrunnsmynd
let background = new Image(); 
background.src = 'https://cdn.tutsplus.com/mobile/uploads/legacy/Corona-SDK_Balloon-Game/6.png'; 

// Breytur stiltar
let gameover = false;
let win = false;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let shiftPressed = false;

let score = 0;

let shooting = false;

// listi fyrir óvini
let enemies = [];

// Object fyrir spilarann
let player = {
    x: width/2, 
    y: height-30,
    radius: 7,
    speed: 6,
    draw: function() { // Fall sem teiknar spilarann á skjáinn
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    },
    shoot: function() { // fall sem leyfir spilaranum að skjóta
        if (!shooting) {
            shooting = true;
            bullet.x = this.x;
            bullet.y = this.y;
        }
    }
}

// Object fyrir skotið
let bullet = {
    x: player.x,
    y: player.y,
    radius: 3,
    speed: 7,
    draw: function() { // fall sem teiknar skotið á skjáinn
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

    }
}

// Fall sem býr til enemy object og setur í lista
function makeEnemy() {
    let enemy = { // enemy object
        active: true,
        x: width/2,
        y: 30,
        radius: 10,
        down: Math.floor(Math.random() * 10) + 10, // random tala milli 10 og 20
        speed: Math.floor(Math.random() * 5) + 5, // random tala milli 5 og 10
        draw: function() { // fall sem teiknar enemy
            if (this.active){ // athugar hvort að enemy er á skjánum
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    enemies.push(enemy); // setur enemy í lista
}

// fall sem fylgist með hvort að spilarinn er búinn að ýta á takka á lyklaborðinu
window.onkeydown = function(e) {
    if (e.key == "ArrowRight") {
        rightPressed = true;
    }
    if (e.key == "ArrowLeft") {
        leftPressed = true;
    }
    if (e.key == "ArrowUp") {
        upPressed = true;
    }
    if (e.key == "ArrowDown") {
        downPressed = true;
    }
    if (e.key == "Shift") {
        shiftPressed = true;
    } 
    if (e.key == "z" || e.key == "Z") {
        player.shoot(); // kallar í shoot fallið hjá spilaranum
    }
    

}

// fall sem fylgist með hvort að spilarinn er búinn að sleppa takka á lyklaborðinu
window.onkeyup = function(e) {
    if (e.key == "ArrowRight") {
        rightPressed = false;
    }
    if (e.key == "ArrowLeft") {
        leftPressed = false;
    }
    if (e.key == "ArrowUp") {
        upPressed = false;
    }
    if (e.key == "ArrowDown") {
        downPressed = false;
    }
    if (e.key == "Shift") {
        shiftPressed = false;
    }
    
}

// athugar hvort að spilarainn er að fara útfyrir canvasinn
// og stillir hraða á spilaranum
function checkBounds() {
    if (shiftPressed) {
        player.speed = 3;
    } else {
        player.speed = 6;
    }
    if (rightPressed && player.x < width - player.radius) {
        player.x += player.speed;
    }
    if (leftPressed && player.x > player.radius) {
        player.x -= player.speed;
    }
    if (upPressed && player.y > player.radius ) {
        player.y -= player.speed;
    }
    if (downPressed && player.y < height - player.radius ) {
        player.y += player.speed;
    }
}

// finnur út hvort að tveir hringir eru að lenda á sama stað
// spilarinn, óvinurinn og skotið eru hringir
function collisionDetection(a,b) {
        let r = a.radius + b.radius;
        let x = a.x - b.x;
        let y = a.y - b.y;
        if (r > Math.sqrt((x * x) + (y * y))) { // útreikningur á hvort að hringir eru að snertast
            return true;
        }
}

// fall sem stoppar leikinn
function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // hreynsar canvasinn
    ctx.drawImage(background, 0, 0, width, height); // teiknar bakgrunnsmynd
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    if (gameover) { // ef gameover er true teiknar forritið Game Over! á skjáinn 
        ctx.fillText("Game Over!", width/2, height/2);
    }
    else { // annars teiknar forritið You win!
        ctx.fillText("You win!", width/2, height/2);
    }
    ctx.closePath();
}

// Fall sem teiknar stiginn á skjáinn
function drawScore() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, 30, 20);
    ctx.closePath();
}

// aðal loopan
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // hreynsar canvasinn
    ctx.drawImage(background, 0, 0, width, height); // teiknar bagrunninn

    checkBounds(); // kallar í checkBounds fallið
    drawScore(); // kallar í drawScore fallið

    if (shooting){ // ef breytan shooting er true
        //drawShots(shotX, shotY);
        bullet.draw(); // teiknar skotið
        bullet.y -= bullet.speed;

        // fyrir hvern enemy í enemies listanum athugar hvort að bullet sé að rekast á enemy
        enemies.forEach(function(enemy, i) {
            if (collisionDetection(bullet, enemy)) {
                enemies.splice(i, 1); // tekur út fremsta stakið úr listanum
                shooting = false;
                score++;
                makeEnemy(); // býr til nýjan enemy
            }
        });
    }
    if (bullet.y < 0) { // ef skotið er kominn út fyrir canvasinn þá hverfur skotið
        shooting = false;
    }

    // fyrir hvern enemy í enemies listanum teiknar hann á canvasinn
    enemies.forEach(function(enemy, i) {
        enemy.x += enemy.speed;
        enemy.draw();
        // ef enemy er kemur við veggina á canvasinum snýr hann við og fer smá niður
        if (enemy.x + enemy.speed > width - enemy.radius || enemy.x + enemy.speed < enemy.radius) {
            enemy.speed = -enemy.speed;
            enemy.y += enemy.down;
        }
        // athugar hvort spilarinn snertir enemy
        if (collisionDetection(player, enemy)) {
            gameover = true;
        }
        // ef enemy nær að far niður fyrir canvasinn missir spilarinn 3 stig
        if (enemy.y > height) {
            score -= 3;
            enemies.splice(i, 1); // tekur út fremsta stakið úr listanum
            makeEnemy(); // býr til nýjan enemy
        }
    });

    player.draw(); // teiknar spilarann
    
    // ef skorið er 10 vinnur spilarinn
    if (score == 10) { 
        win = true; 
    }
    // ef skorið er -10 eða minna tapar spilarinn 
    else if (score <= -10) {
        gameover = true;
    }
    
    // ef gameover eða win er true kallar forritið í endGame fallið
    if (gameover || win) {
        endGame(); // kallar í endGame fallið
    }
    // annars er draw keyrt aftur
    else {
        requestAnimationFrame(draw);
    }
}   

makeEnemy(); // býr til enemy
draw(); // kallari í draw fallið
