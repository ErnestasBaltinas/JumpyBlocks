let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const Game = function (){
  this.gravity = 0.3; // strength per frame of gravity
  this.drag= 0.988; // play with this value to change drag
  this.friction= 0.90; // friction - play with this value to change ground movement
  this.score = 0;
  this.highScore = 0;
}

Game.prototype = {
  render: function(){
    // draw background
    drawObject(0,0,canvas.width, canvas.height, "#b3d9ff");

    // draw foreground
    drawObject(0,250,canvas.width, canvas.height, "#ff944d");

    player.render();
    //enemy.render();

    for (let i = 0; i < boxes.length; i++) {
      boxes[i].render();
    }

    this.drawScore();
  },

  update: function() {
    if (controls.left ) { player.moveLeft ();}
    if (controls.right) { player.moveRight();}
    if (controls.up) { player.jump(); }

    player.updatePosition();

    // box movement
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].moveLeft();
      boxes[i].jump();
      boxes[i].updatePosition();

      // reroll properties if outside of screen
      if (boxes[i].x + boxes[i].size < 0) {
        boxes[i].color = getRandomColor();
        boxes[i].jumpPower = -getRandomInt(0,15);
        boxes[i].speed = getRandomInt(2,8)

        boxes[i].x += ctx.canvas.width;
      }
    }

  },
  checkBoundaries: function(obj){
    this.checkBoundariesX(obj);
    this.checkBoundariesY(obj);
  },

  checkBoundariesX: function(obj){
    // X
    if (obj.x > ctx.canvas.width) {
      obj.x -= ctx.canvas.width;
    } else if (obj.x + obj.size < 0) {
      obj.x += ctx.canvas.width;
    }
  },
  checkBoundariesY: function(obj){
    // y
    if (obj.y + obj.size >= 250) {
      obj.y = 250 - obj.size;
      obj.velocityY = 0;
      obj.isJumping = false;
    } else {
      obj.isJumping = true;
    }
  },
  drawScore: function() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#fff";
		ctx.fillText("Score: "+game.score, 8, 280);

    ctx.font = "16px Arial";
		ctx.fillStyle = "#fff";
		ctx.fillText("High Score: "+game.highScore, 330, 280);
	}
}

const Entity = function(x, y, size, color, jumpPower, speed){
  this.x = x;
  this.y = y;
  this.size = size;
  this.velocityX = 0;
  this.velocityY = 0;
  this.color = color;
  this.directionX = 1;
  this.isJumping = false;
  this.jumpPower = jumpPower;
  this.speed = speed;
}

Entity.prototype = {
  jump: function(jumpPower = this.jumpPower) {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY = jumpPower;
    }
  },

  moveLeft: function(speed = this.speed) {
    this.directionX = -1;
    this.velocityX = -speed;
  },

  moveRight:function(speed = this.speed) {
    this.directionX = 1;
    this.velocityX = speed;
  },

  updatePosition: function(){
    // apply gravity drag and move player
    this.velocityY += game.gravity;
    this.velocityY *= game.drag;
    this.velocityX *= !this.isJumping ? game.friction : game.drag;
    this.x += this.velocityX;
    this.y += this.velocityY;
  },

  render: function(){
    drawObject(this.x, this.y, this.size, this.size, this.color);
  },

  kill: function(){
    this.x = 50;
    this.y = 0;
    game.score = 0;
  }
}

let game = new Game();
let player = new Entity(50, 230, 20, "#ff4d4d", -12, 4);
let boxes = new Array();
boxes.push(new Entity(canvas.width-20, 250, 20, getRandomColor(), -6, 2));
boxes.push(new Entity(canvas.width-20, 250, 20, getRandomColor(), -10, 3));
boxes.push(new Entity(canvas.width-20, 250, 20, getRandomColor(), -8, 5));


function checkBoxCollision(box){
  return (box.x < player.x + player.size && box.x + box.size > player.x && box.y < player.y + player.size && box.y + box.size > player.y)
}

// controls
let KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    controls = { left: false, right: false, up: false};

function onkey(ev, key, down) {
  switch(key) {
    case KEY.LEFT:  controls.left  = down; ev.preventDefault(); return false;
    case KEY.RIGHT: controls.right = down; ev.preventDefault(); return false;
    case KEY.UP: controls.up  = down; ev.preventDefault(); return false;
  }
}

// keyboard events
document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

// the game loop

const Engine = function(){

  this.animation_frame_request = undefined,


  this.start = function() {

    game.render();
    game.update();
    game.checkBoundaries(player);
    //game.checkBoundaries(enemy);

    for (let i = 0; i < boxes.length; i++) {
      game.checkBoundariesY(boxes[i]);
      if(checkBoxCollision(boxes[i])){
        if(boxes[i].color == player.color){
          boxes[i].x = -boxes[i].size;// move box out of the boundaries
          game.score += 10;
          if(game.highScore <= game.score){
            game.highScore = game.score;
          }
        } else {
          player.kill();
        }

      }
    }

    this.animation_frame_request = requestAnimationFrame(this.handleStart);
  };


  this.stop = function() {
      cancelAnimationFrame(this.animation_frame_request);
  }

  this.handleStart = () => {this.start();}
}

let engine = new Engine();
engine.start(); //start the game
