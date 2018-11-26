"use strict";
const debugMode = true;
const frameDebug = false;
const targetFrameRate = 60;
const backgroundColor = 0;


let points_string = '';
let points_string_location;
var FPS_string  = '';
var FPS_string_location;
let Game_Over_string = 'Global Over. Press [Enter] to start again.';
let Game_Over_string_location;
const backgroundStarCount = 25;
let overlay_line1_string_location;
let overlay_line1_string = '';
let overlay_line2_string_location;
let overlay_line2_string = '';
let overlay_line3_string_location;
let overlay_line3_string= '';
let overlay_line4_string_location;
let overlay_line4_string= '';



let Global = {};
Global.canvasWidth = 700;
Global.canvasHeight = 700;
Global.points = 0;
Global.images = {};
Global.backgroundStars = [];
Global.foregroundObjects = [];
Global.sprites = {};
Global.shieldScale = 1.2;
Global.animations = {};

//p5.play sprite groups
var bulletGroup;
var friendlyGroup;
var enemyGroup;
var enemyShipGroup;

function reset() {
    let canvas = createCanvas(Global.canvasWidth, Global.canvasHeight);
    canvas.parent('sketch-holder');
    canvas.drawingContext.imageSmoothingEnabled = false;

    frameRate(targetFrameRate);
    background(0);

    Global.textColor = color(255);

    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Global.textColor);
    fill(Global.textColor);

    Global.points = 0;

    Global.soundMgr = new SoundManager();
    Global.soundMgr.mute = true;

    Global.ParticleSystem = new ParticleSystem();

    bulletGroup = new Group();
    friendlyGroup = new Group();
    enemyGroup = new Group();
    enemyShipGroup = new Group();


    points_string_location = createVector(Global.canvasWidth*(19/24),20);
    FPS_string_location = createVector(10,20);
    Game_Over_string_location = createVector(Global.canvasWidth/5,Global.canvasHeight/2);

    overlay_line1_string_location = createVector(10,Global.canvasHeight*(1/6))
    overlay_line2_string_location = createVector(10,Global.canvasHeight*(2/6))
    overlay_line3_string_location = createVector(10,Global.canvasHeight*(3/6))
    overlay_line4_string_location = createVector(10,Global.canvasHeight*(4/6))

    Global.backgroundStars = [];
    preFillBackgroundStars();

    setInterval(halfSecondUpdateLoop,500);
    let enemy_sprite = createSprite(Global.canvasWidth/2,200,Global.images.enemy1.width,Global.images.enemy1.height);
    enemy_sprite.addImage (Global.images.enemy1);
    enemy_sprite.scale = 3;
    enemy_sprite.mirrorY(-1);
    enemy_sprite.setDefaultCollider();
    enemy_sprite.hasShield = true;
    enemy_sprite.friction = 0.01;
    enemy_sprite.health = 5;
    enemy_sprite.damage = 20
    enemy_sprite.point_value = 10+10;
    enemyGroup.add(enemy_sprite);
    enemyShipGroup.add(enemy_sprite);


    //create sprite in lower middle of screen,with normal size collision box
    Global.sprites.player_sprite = createSprite(Global.canvasWidth/2,Global.canvasHeight*(5/6),Global.images.player_ship.width,Global.images.player_ship.height)
    Global.sprites.player_sprite.addImage(Global.images.player_ship);
    Global.sprites.player_sprite.setDefaultCollider();
    Global.sprites.player_sprite.scale = 3;
    Global.sprites.player_sprite.health = 5;
    Global.sprites.player_sprite.damage = 20;
    Global.sprites.player_sprite.hasShield = true;
    Global.sprites.player_sprite.GunCooldown = new GunCooldown(15);

    //TODO : drop all sprites during reset
}

function preload()
{
  Global.images.ship1 = loadImage('img/ship1.png');
  Global.images.ship2 = loadImage('img/ship2.png');
  Global.images.cyan_bolt = loadImage('img/cyan_bullet2.png');
  Global.images.enemy3 = loadImage('img/enemy3.png');
  Global.images.player_ship = loadImage('img/player_ship.png');
  Global.images.purple_bolt = loadImage('img/purple_bullet.png');
  Global.images.enemy1 = loadImage('img/enemy1.png');
  Global.images.cyan_bolt2 = loadImage('img/cyan_bullet2.png');
  Global.images.red_bolt = loadImage('img/red_bullet.png');
  let rotary_explosion_images = 5;
  let rotary_explosion_sprite_sheet = loadSpriteSheet('img/rotary_explosion.png',16,16,rotary_explosion_images);
  Global.animations.rotary_explosion = loadAnimation(rotary_explosion_sprite_sheet);
  Global.animations.rotary_explosion.frameDelay  = targetFrameRate/rotary_explosion_images;
}

function setup() {
  reset();
}

function draw() {

    handleUserInput();

    //BACKGROUND
    background(backgroundColor); //black color

    //do physics and render background items
    for(let i = Global.backgroundStars.length -1; i >= 0; i--)
    {
      console.assert(typeof Global.backgroundStars[i].render === "function");
      console.assert(typeof Global.backgroundStars[i].update === "function");
      Global.backgroundStars[i].render();
      Global.backgroundStars[i].update();
    }

    Global.ParticleSystem.run();
    //BACKGROUND

    //FOREGROUND
    drawSprites();

    //run foreground physics
    //move player
    let newPos = createVector(mouseX,mouseY);
    if(onCanvas(newPos.x,newPos.y))
    {
      Global.sprites.player_sprite.position = newPos;
      Global.sprites.player_sprite.setDefaultCollider()
    }

    //check all collisions
    for(let i = allSprites.length - 1; i >= 0; i--)
    {
        let mainSprite = allSprites[i];

        //render shields while we are here
        if(mainSprite.hasShield && mainSprite.visible && !mainSprite.removed)
        {
            rectMode(CENTER);
            fill(0,0,0,0);
            stroke(255);
            let radius = Math.max(mainSprite.width*Global.shieldScale,mainSprite.height*Global.shieldScale);
            ellipse(mainSprite.position.x,mainSprite.position.y,radius,radius)
        }

        for(let j = allSprites.length - 1; j >= 0; j--)
        {
            let targetSprite = allSprites[j]

            if(friendlyGroup.contains(mainSprite) && enemyGroup.contains(targetSprite))
            {
                let collides = mainSprite.bounce(targetSprite);
                if(collides)
                {
                    if(targetSprite.hasShield)
                    {
                       targetSprite.hasShield=false;
                       Global.ParticleSystem.addParticleSpray(mainSprite.position,color(255),3,10);
                    }
                    else
                    {
                        Global.ParticleSystem.addParticleSpray(mainSprite.position,targetSprite.shapeColor,3,10);
                        targetSprite.health -= mainSprite.damage;
                    }
                }
                if(collides && bulletGroup.contains(mainSprite))
                {
                    mainSprite.remove();
                }
                if(collides && bulletGroup.contains(targetSprite))
                {
                    targetSprite.remove();
                }
            }

          //take care of explosions
          if(targetSprite.health <= 0)
          {
            if(enemyGroup.contains(targetSprite) && targetSprite.point_value)
            {
              Global.points += targetSprite.point_value;
            }
            let newpos = targetSprite.position;
            targetSprite.remove();
            let explode_sprite = createSprite(newpos.x, newpos.y, 16, 16);
            explode_sprite.scale = 3
            explode_sprite.life = 60;
            explode_sprite.addAnimation('explode', Global.animations.rotary_explosion);
          }
        }
    }

    //FOREGROUND

    //UI
    renderUI();
    //UI


    //play all the sounds we've built up this frame
    Global.soundMgr.playAllQueuedSounds();

    //do some one-per-frame sprite managment work
    //set the particle color for the sprite, since we can only do that once it's rendered.
    if(allSprites.length > 0)
    {
        let idx = frameCount % allSprites.length
        let spr = allSprites[idx];
        if(!spr.hasTrueShapeColor && spr.visible && onCanvas(spr.position.x,spr.position.y))
        {
            let newColor = get(spr.position.x,spr.position.y);
            if(isABrightColor(newColor))
            {
              spr.shapeColor = newColor;
              spr.hasTrueShapeColor = true;
            }
        }
    }

    if(frameDebug)
    {
      //freeze for analysis
      throw 'freeze';
    }
}


function mousePressed()
{
    playerShootEvent();
}

//handles continuous presses
var handleUserInput = function()
{
  if(keyIsDown(32)/*space*/ || mouseIsPressed)
  {
    playerShootEvent();
  }
};

function keyPressed() {
  if(keyCode == ENTER || keyCode == RETURN)
  {
    reset();
  }

  if(key == 'S')
  {
    Global.backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight))));
  }


  if(key == 'O' && debugMode == true)
  {
    let player = Global.sprites.player_sprite;
    if(player.hasShield)
    {
       player.hasShield=false;
       Global.ParticleSystem.addParticleSpray(player.position,color(255),3,10);
    }
    else
    {
        Global.ParticleSystem.addParticleSpray(player.position,player.shapeColor,3,10);
    }
  }

  if(key == 'P' && debugMode == true)
  {
      let player = Global.sprites.player_sprite;
      let explode_sprite = createSprite(player.position.x+100, player.position.y, 16, 16);
      explode_sprite.scale = 3
      explode_sprite.life = 60;
      explode_sprite.addAnimation('explode', Global.animations.rotary_explosion);

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
    text(overlay_line1_string,overlay_line1_string_location.x,overlay_line1_string_location.y);
    text(overlay_line2_string,overlay_line2_string_location.x,overlay_line2_string_location.y);
    text(overlay_line3_string,overlay_line3_string_location.x,overlay_line3_string_location.y);
    text(overlay_line4_string,overlay_line4_string_location.x,overlay_line4_string_location.y);
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

function onCanvas(x,y)
{
  if(x<0 || x > Global.canvasWidth)
  {
    return false;
  }
  if(y<0 || y > Global.canvasHeight)
  {
    return false;
  }
  return true;
}

function playerShootEvent()
{
    if(Global.sprites.player_sprite && Global.sprites.player_sprite.GunCooldown.canFire(frameCount))
    {
        Global.sprites.player_sprite.GunCooldown.fire(frameCount);
        let posx = Global.sprites.player_sprite.position.x;
        let posy = Global.sprites.player_sprite.position.y;
        let h = Global.images.red_bolt.height
        let w = Global.images.red_bolt.width
        let new_bullet = createSprite(posx,posy,h,w);
        new_bullet.addImage(Global.images.red_bolt);
        new_bullet.scale = 3;
        let yvel = -4.5
        new_bullet.setVelocity(0,yvel);
        new_bullet.mass = 0.2;
        new_bullet.damage = 10;
        new_bullet.life = Math.floor(Math.abs(Global.canvasHeight / yvel)+h);
        bulletGroup.add(new_bullet);
        friendlyGroup.add(new_bullet);

        Global.soundMgr.queueSound('proton_bolt');
    }
}

function isABrightColor(color)
{
  let minColor = 100;
  return (red(color)+green(color)+blue(color))>minColor;
}