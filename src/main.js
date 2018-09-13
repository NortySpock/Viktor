"use strict";
var debugMode = false;
var frameDebug = false;

var backgroundStars = [];

var points_string = '';
var points_string_location;
var FPS_string  = '';
var FPS_string_location;
var Game_Over_string = 'Game Over. Press [Enter] to start again.';
var Game_Over_string_location;
var backgroundStarCount = 20;

var ship1;
var ship2;

var ship;

var Game = {};
Game.canvasWidth = 700;
Game.canvasHeight = 700;
Game.points = 0;


function reset() {
    var canvas = createCanvas(Game.canvasWidth, Game.canvasHeight);
    canvas.parent('sketch-holder');

    frameRate(60);
    background(0);

    Game.textColor = color(255);

    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Game.textColor);
    fill(Game.textColor);

    Game.points = 0;

    ship = new Ship();

    Game.soundMgr = new SoundManager();


    points_string_location = createVector(Game.canvasWidth*(19/24),20);
    FPS_string_location = createVector(10,20);
    Game_Over_string_location = createVector(Game.canvasWidth/5,Game.canvasHeight/2);

    backgroundStars = [];
    preFillBackgroundStars();

    setInterval(halfSecondUpdateLoop,500);
}

function preload()
{
  ship1 = loadImage('img/ship1.png');
  ship2 = loadImage('img/ship2.png');
}

function setup() {
  reset();
}

function draw() {

    handleKeyInput();

    //BACKGROUND
    background(0);

    for(var i = backgroundStars.length -1; i >= 0; i--)
    {
      backgroundStars[i].update();
      backgroundStars[i].render();
    }
    //BACKGROUND

    //FOREGROUND
    image(ship2, ship.pos.x, ship.pos.y);
    //FOREGROUND

    //UI
    renderUI();
    //UI


    //play all the sounds we've built up this frame
    //soundMgr.playAllQueuedSounds();

    if(frameDebug)
    {
      //freeze for analysis
      throw 'freeze';
    }
}


function mousePressed()
{

}

//handles continuous presses
var handleKeyInput = function()
{
    //key handling
    if(keyIsDown(UP_ARROW) || keyIsDown(87) /* w */)
    {
      ship.pos.y--;
    }
    if(keyIsDown(DOWN_ARROW) || keyIsDown(83) /* s */)
    {
      ship.pos.y++;
    }
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65) /* a */)
    {
      ship.pos.x--;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68) /* d */)
    {
      ship.pos.x++;
    }
};

function keyPressed() {
  if(key == ' ')
  {
    Game.soundMgr.queueSound('proton_bolt');
  }

  if(keyCode == ENTER || keyCode == RETURN)
  {
    reset();
  }

  if(key == 'P')
  {
    ship.triggerSound();
  }

  if(key == 'S')
  {
    backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Game.canvasWidth),randomFromInterval(0,Game.canvasHeight))));
  }


  if(key == 'O')
  {
    console.log('pressed oats')
  }
};

function randomFromInterval(min,max){
    return Math.random()*(max-min+1)+min;
}

function coinFlip()
{
  return (int(Math.random() * 2) == 0);
}

function updateUIstuff()
{
  var fps = frameRate();
  FPS_string = "FPS:" + fps.toFixed(0);

  points_string = "Points: " + Game.points;
}

function renderUI()
{
    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Game.textColor);
    fill(Game.textColor);
    text(FPS_string, FPS_string_location.x,FPS_string_location.y);
    text(points_string,points_string_location.x,points_string_location.y);
}

function halfSecondUpdateLoop(){
  updateUIstuff();
}

function preFillBackgroundStars()
{
  while(backgroundStars.length < backgroundStarCount)
  {
    backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Game.canvasWidth),randomFromInterval(0,Game.canvasHeight))));
  }
}

class Ship
{
  constructor()
  {
    this.pos = createVector(Game.canvasWidth/2,Game.canvasHeight/2);
  }

  triggerSound()
  {
    Game.soundMgr.queueSound('test_sound');
  }
}