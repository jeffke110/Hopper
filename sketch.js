/*Project 4 - Hopper
Name: Jeffrey Kedda
Description: this is a simple jump game that is possible to beat (just a little hard) 
Avoid the balls that will spawn in the top
left corner every 2 seconds. If the player touches the ball, the player loses.
If the player reaches the top left platform without getting hit by the ball, the player wins.
The player can go through the top set of stairs from the bottom set of stairs.
On the far right platfrom, the player must walk to the left to get down to the bottom set of stairs.
Controls: 
Left arrow key: move left
Right arrow key: move right
Up arrow key: jump
*/
//staircase Global Varaibles
var stairBlockTemp, stairCaseTileMapObject;
// 20x20 red block
class stairBlock {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  draw(x, y) {
    this.x = x;
    this.y = y;
    fill(255, 165, 0);

    rect(this.x - 10, this.y - 10, 20, 15);
  }
}
// 20x21 Tilemap
class staircaseTileMap {
  constructor() {
    this.tilemap = [
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "lcr                  ",
      "   lcr               ",
      "      lcr            ",
      "         lcr         ",
      "            lcr      ",
      "               lcs   ",
      "                  lcr",
      "               lcr   ",
      "            lcr      ",
      "         lcr         ",
      "      lcr            ",
      "   lcr               ",
      "lcr                  ",
    ];
    this.stairBlocks = [];
  }
  initializeStairBlocks() {
    for (var i = 0; i < this.tilemap.length; i++) {
      for (var j = 0; j < this.tilemap[i].length; j++) {
        if (this.tilemap[i][j] == 'l') {
          this.stairBlocks.push(new stairBlock(j * 20, i * 20, 0));
        } else if (this.tilemap[i][j] == 'c') {
          this.stairBlocks.push(new stairBlock(j * 20, i * 20, 1));
        } else if (this.tilemap[i][j] == 'r') {
          this.stairBlocks.push(new stairBlock(j * 20, i * 20, 2));
        } else if (this.tilemap[i][j] == 's') {
          this.stairBlocks.push(new stairBlock(j * 20, i * 20, 3));
        }
      }
    }
  }
  drawStairBlocks() {
    for (var i = 0; i < this.tilemap.length; i++) {
      for (var j = 0; j < this.tilemap[i].length; j++) {
        if (this.tilemap[i][j] != ' ') {
          stairBlockTemp.draw(j * 20, i * 20);
        }
      }
    }
  }
}
function initializeTileMapVariables() {
  stairCaseTileMapObject = new staircaseTileMap();
  stairCaseTileMapObject.initializeStairBlocks();
  stairBlockTemp = new stairBlock(0, 0);
}
//ball Global Variables
var ball = [];
var gravity, wind;
var windSpeed = .013;
class ballObject {
  constructor(x, y) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.size = random(20, 50);
    this.mass = this.size / 5;

    //random color generator
    this.c1 = random(0, 255);
    this.c2 = random(0, 255);
    this.c3 = random(0, 255);
  }
  applyForce(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  updatePosition() {
    //intialize force vectors
    var gravityForce = p5.Vector.mult(gravity, this.mass);
    this.applyForce(gravityForce);
    var windForce = p5.Vector.mult(wind, this.mass);
    windForce.mult(windSpeed);
    this.applyForce(windForce);
    var airFriction = p5.Vector.mult(this.velocity, -0.02);
    this.applyForce(airFriction);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    //bounce off ground
    if (this.position.y > (height - this.size / 2)) {
      this.position.y = height - this.size / 2;
      this.velocity.y *= -1;
    }
    if (this.position.x < (-this.size / 2)) {
      this.position.x = width + this.size / 2;
    }
    this.acceleration.set(0, 0);
  }
  draw() {
    fill(this.c1, this.c2, this.c3);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    var startAng = .1 * PI
    var endAng = .9 * PI
    var smileDiam = .6 * this.size;
    arc(this.position.x, this.position.y, smileDiam, smileDiam, startAng, endAng);
    var offset = .15 * this.size;
    var eyeDiam = .1 * this.size;
    fill(0);
    //eyes
    line(this.position.x - offset - 5, this.position.y - offset - 8, this.position.x - 1, this.position.y - 4);
    line(this.position.x + offset + 5, this.position.y - offset - 8, this.position.x + 1, this.position.y - 4);
    ellipse(this.position.x - offset, this.position.y - offset, eyeDiam, eyeDiam);
    ellipse(this.position.x + offset, this.position.y - offset, eyeDiam, eyeDiam);

  }
  checkCollision() {
    for (var i = 0; i < stairCaseTileMapObject.stairBlocks.length; i++) {
      var stairBlock = stairCaseTileMapObject.stairBlocks[i];
      if (dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) < (10 + this.size / 2)) {
        this.position.y = stairBlock.y - this.size / 2 - 10;
        this.velocity.y *= -1;
      }
      if (dist(this.position.x, this.position.y, playerObject.position.x, playerObject.position.y) < this.size / 2 + 12) {
        gameOver = 1;
      }
    }
  }
}
function drawBalls() {
  if(frameCount % 60 == 0){
    ball.push(new ballObject(5, -40));
  }
  for (var i = 0; i < ball.length; i++) {

    ball[i].updatePosition();
    ball[i].checkCollision();
    ball[i].draw();
  }
}
function initializeBallVariables() {
  gravity = new p5.Vector(0, 0.1);
  wind = new p5.Vector(1, 0);
}
//player Global Variables
var gravity, walkForce, backForce, jumpForce, playerObject;
class player {
  constructor(x, y) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.force = new p5.Vector(0, 0);
    this.currFrame = frameCount;
    this.jump = 0;
    this.walkForward = 0;
    this.walkBackward = 0;
    this.onPlatformS = 0;
  }
  applyForce(force) {
    this.acceleration.add(force);
  }
  update() {
    this.acceleration.set(0, 0);
    if (this.walkForward === 1 && this.velocity.x < 3) {
      this.applyForce(walkForce);
    } else if (this.walkBackward === 1 && this.velocity.x > -3) {
      this.applyForce(backForce);
    } else if (this.velocity.x > 0) {
      var walkFriction = new p5.Vector(-.05, 0);
      this.applyForce(walkFriction);
    } else if (this.velocity.x < 0) {
      var walkFriction = new p5.Vector(.05, 0);
      this.applyForce(walkFriction);
    }
    if (this.jump === 2) {
      this.applyForce(jumpForce);
      this.jump = 1;
    }
    if (this.jump > 0) {
      this.applyForce(gravity);
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);

    //reset position
    if (this.position.x > 400) {
      this.position.x = 400;
    } else if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.y >= 334.99) {
      this.position.y = 335;
      this.velocity.y = 0;
      this.jump = 0;
    }
  }
  draw() {

    fill(253, 238, 223);
    ellipse(this.position.x, this.position.y, 20, 40)
    fill(0); //eyes
    ellipse(this.position.x - 3, this.position.y, 2, 4);
    ellipse(this.position.x + 3, this.position.y, 2, 4);
    ellipse(this.position.x + 1, this.position.y + 10, 2, 4);
    fill(255, 0, 0);
    rect(this.position.x - 7, this.position.y - 23, 15, 10);
    rect(this.position.x - 7, this.position.y - 12, 25, 3);
    switch (this.jump) {
      case 0:
        line(this.position.x + 5, this.position.y + 12, this.position.x + 10,
          this.position.y + 20); //arms
        line(this.position.x - 5, this.position.y + 12, this.position.x - 10,
          this.position.y + 20);
        line(this.position.x, this.position.y + 20, this.position.x + 10,
          this.position.y + 35); // legs
        line(this.position.x, this.position.y + 20, this.position.x - 10,
          this.position.y + 35);
        break;
      case 1:
        line(this.position.x + 5, this.position.y + 12, this.position.x + 10,
          this.position.y + 20); //arms
        line(this.position.x - 5, this.position.y + 12, this.position.x - 10,
          this.position.y + 20);
        line(this.position.x, this.position.y + 20, this.position.x + 10,
          this.position.y + 23); // legs
        line(this.position.x, this.position.y + 20, this.position.x - 10,
          this.position.y + 23);
        break;
    }
  }
  checkCollision() {
    for (var i = 0; i < stairCaseTileMapObject.stairBlocks.length; i++) {
      var stairBlock = stairCaseTileMapObject.stairBlocks[i];


      //creating top boundery of platform
      if (dist(this.position.x, 0, stairBlock.x, 0) < (12) && dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) > (40) && dist(0, this.position.y, 0, stairBlock.y) < (45) && stairBlock.y > this.position.y) {
        this.position.y = stairBlock.y - 45;
        this.velocity.y = 0;
        this.jump = 0;
        //check game win
        if(i < 4){
          gameOver = 2;
        }
      }
      //goes of left side of ledge
      else if (stairBlock.type == 0 && stairBlock.x - this.position.x > 10 && this.position.y == stairBlock.y - 45) {
        this.jump = 1;
      }
      //goes of right side of ledge
      else if ((stairBlock.type == 2 || stairBlock.type == 3) && this.position.x - stairBlock.x > 10 && this.position.y == stairBlock.y - 45) {
        this.jump = 1;
      }
      //if character goes within platform
      else if (i != 15 && i != 16 && i != 17 && stairBlock.type != 3 && dist(this.position.x, this.position.y + 25, stairBlock.x, stairBlock.y) < (7)) {
        this.position.y = stairBlock.y - 45;
        this.velocity.y = 0;
        this.jump = 0;
      }
      //collsion of left of platform
      else if (stairBlock.type == 0 && this.velocity.x > 0 && dist(this.position.x, 0, stairBlock.x, 0) < (16) && this.position.y + 25 == stairBlock.y) {
        this.position.x = stairBlock.x - 16;
        this.velocity.x = 0;
      }
      //collision of right of platform
      else if (stairBlock.type == 2 && this.velocity.x < 0 && dist(this.position.x, 0, stairBlock.x, 0) < (16) && this.position.y + 25 == stairBlock.y) {
        this.position.x = stairBlock.x + 16;
        this.velocity.x = 0;
      }

    }
  }
}
function initializePlayerVariables() {
  gravity = new p5.Vector(0, 0.15);
  walkForce = new p5.Vector(0.13, 0);
  backForce = new p5.Vector(-0.13, 0);
  jumpForce = new p5.Vector(0, -4);
  playerObject = new player(10, 335);
}
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    playerObject.walkForward = 1;
  }
  if (keyCode === LEFT_ARROW) {
    playerObject.walkBackward = 1;
  }
  if ((keyCode === UP_ARROW) && (playerObject.jump === 0)) {
    playerObject.jump = 2;
  }
}
function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    playerObject.walkForward = 0;
  } else if (keyCode === LEFT_ARROW) {
    playerObject.walkBackward = 0;
  }
}
var gameOver = 0;
function setup() {
  createCanvas(400, 400);
  frameRate(30);
  initializeTileMapVariables();
  initializeBallVariables();
  initializePlayerVariables();
}
function draw() {
  background(240);

  stairCaseTileMapObject.drawStairBlocks();
  playerObject.draw();
  
  if (gameOver == 0) {
    drawBalls();
    playerObject.checkCollision();
    playerObject.update();
  }else if(gameOver == 1){
    fill(255,0,0);
    textSize(32);
    text("Game Over", 130, 200);
    text("You Lose", 140, 240);
    text("Press Space to play gain", 10, 50);
    if(keyCode == 32){
      initializeTileMapVariables();
      initializeBallVariables();
      initializePlayerVariables();
      ball = [];
      gameOver = 0;   
    }
  }else if(gameOver == 2){
    fill(255,0,0);
    textSize(32);
    text("Game Over", 130, 200);
    text("You Win", 140, 240);
    text("Press Space to play again", 10, 50);
    if(keyCode == 32){
      initializeTileMapVariables();
      initializeBallVariables();
      initializePlayerVariables();
      ball = [];
      gameOver = 0;      
    }
  }
}