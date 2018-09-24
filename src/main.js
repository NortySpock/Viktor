"use strict";
const debugMode = false;
const frameDebug = false;
const backgroundColor = 0;

let points_string = '';
let points_string_location;
var FPS_string  = '';
var FPS_string_location;
let Game_Over_string = 'Global Over. Press [Enter] to start again.';
let Game_Over_string_location;
const backgroundStarCount = 25;

let ship;

let Global = {};
Global.canvasWidth = 700;
Global.canvasHeight = 700;
Global.points = 0;
Global.images = {};
Global.backgroundStars = [];


function reset() {
    let canvas = createCanvas(Global.canvasWidth, Global.canvasHeight);
    canvas.parent('sketch-holder');

    frameRate(60);
    background(0);

    Global.textColor = color(255);

    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Global.textColor);
    fill(Global.textColor);

    Global.points = 0;

    ship = new Ship();

    Global.soundMgr = new SoundManager();


    points_string_location = createVector(Global.canvasWidth*(19/24),20);
    FPS_string_location = createVector(10,20);
    Game_Over_string_location = createVector(Global.canvasWidth/5,Global.canvasHeight/2);

    Global.backgroundStars = [];
    preFillBackgroundStars();

    setInterval(halfSecondUpdateLoop,500);
}

function preload()
{
  Global.images.ship1 = loadImage('img/ship1.png');
  Global.images.ship2 = loadImage('img/ship2.png');
  Global.images.cyan_bolt = loadImage('img/cyan_bolt.png');
  Global.images.enemy3 = loadImage('img/enemy3.png');
}

function setup() {
  reset();
}

function draw() {

    handleKeyInput();

    //BACKGROUND
    background(backgroundColor); //black color

    for(let i = Global.backgroundStars.length -1; i >= 0; i--)
    {
      console.assert(typeof backgroundStars[i].update === "function"));
      console.assert(typeof backgroundStars[i].render === "function"));
      Global.backgroundStars[i].update();
      Global.backgroundStars[i].render();
    }
    //BACKGROUND

    //FOREGROUND
    image(Global.images.ship2, ship.pos.x, ship.pos.y);
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
    Global.soundMgr.queueSound('proton_bolt');
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
    Global.backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight))));
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

  points_string = "Points: " + Global.points;
}

function renderUI()
{
    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Global.textColor);
    fill(Global.textColor);
    text(FPS_string, FPS_string_location.x,FPS_string_location.y);
    text(points_string,points_string_location.x,points_string_location.y);
}

function halfSecondUpdateLoop(){
  updateUIstuff();
}

function preFillBackgroundStars()
{
  while(Global.backgroundStars.length < backgroundStarCount)
  {
    Global.backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight))));
  }
}



class Ship
{
  constructor()
  {
    this.pos = createVector(Global.canvasWidth/2,Global.canvasHeight/2);
  }

  triggerSound()
  {
    Global.soundMgr.queueSound('test_sound');
  }
}