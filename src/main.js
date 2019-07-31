"use strict";
const debugMode = true;
const frameDebug = false;
const targetFrameRate = 60;

const backgroundColor = 0;
const playerInvulnerableDebug = false;

let pointsString = '';
let pointsStringLocation;
var FPSstring  = '';
var FPSstringLocation;
const Game_Over_string = 'Game Over. Press [Enter] to start again.';
let Game_Over_string_location;
let Game_Over_shots_location;
let Game_Over_hit_percent_location;
let Game_Over_status = false;
const backgroundStarCount = 25;
let attackAIcounter = 0;

let Global = {};
Global.canvasWidth = 700;
Global.canvasHeight = 700;
Global.images = {};
Global.backgroundStars = [];
Global.foregroundObjects = [];
Global.sprites = {};
Global.shieldScale = 1.2;
Global.animations = {};
Global.playerDead = false;

//p5.play sprite groups
Global.bulletGroup;
Global.friendlyGroup;
Global.enemyGroup;
Global.enemyShipGroup;

function reset() {
    Global.enableStory = true;
    Global.enableSound = true;

    let canvas = createCanvas(Global.canvasWidth, Global.canvasHeight);
    canvas.parent('sketch-holder');
    canvas.drawingContext.imageSmoothingEnabled = false;

    frameRate(targetFrameRate);
    background(0);

    Global.backgroundColor = color(0);
    Global.textColor = color(255);
    Global.playerDead = false;

    Global.points = 0;

    Global.soundMgr = new SoundManager();
    Global.soundMgr.mute = !Global.enableSound;
    Global.enemyCreator = new EnemyCreator();
    Global.waveManager = new WaveManager();
    Global.waypointManager = new WaypointManager();
    Global.director = new DirectorAI();

    Global.ParticleSystem = new ParticleSystem();
    Global.textHandler = new TextHandler();

    Global.bulletGroup = new Group();
    Global.friendlyGroup = new Group();
    Global.enemyGroup = new Group();
    Global.enemyShipGroup = new Group();


    pointsStringLocation = createVector(Global.canvasWidth*(19/24),20);
    FPSstringLocation = createVector(10,20);
    Game_Over_string_location = createVector(Global.canvasWidth/5,Global.canvasHeight/2);
    Game_Over_shots_location = createVector(Global.canvasWidth/5,Global.canvasHeight*(4/6));
    Game_Over_hit_percent_location = createVector(Global.canvasWidth/5,Global.canvasHeight*(5/6));

    Global.backgroundStars = [];
    preFillBackgroundStars();

    setInterval(halfSecondUpdateLoop,500);

    //drop all sprites for reset
    for(let i = allSprites.length - 1; i >= 0; i--)
    {
        let mainSprite = allSprites[i];
        if(mainSprite)
        {
          mainSprite.remove();
        }
    }

    Global.PlayerShotsHit = 0;
    Global.PlayerShotsTotal = 0;
    Global.PlayerHitPercent = 0;

    createPlayerSprite();

    startGameMusic();
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

  let blue_explosion_images = 5;
  let blue_explosion_sprite_sheet = loadSpriteSheet('img/blue_explosion.png',16,16,blue_explosion_images);
  Global.animations.blue_explosion = loadAnimation(blue_explosion_sprite_sheet);
  Global.animations.blue_explosion.frameDelay  = targetFrameRate/blue_explosion_images;
}

function setup() {
  reset();
  Global.soundMgr.mute = false;
}

function draw() {

    handleUserInput();

    //BACKGROUND
    background(Global.backgroundColor); //black color

    //do physics and render background items
    for(let i = 0; i < Global.backgroundStars.length;i++)
    {
      Global.backgroundStars[i].render();
      Global.backgroundStars[i].update();
    }

    Global.ParticleSystem.run();

    renderBackgroundUI();
    //BACKGROUND

    //FOREGROUND
    drawSprites();

    //run foreground physics
    //move player
    let newPos = createVector(mouseX,mouseY);
    if(onCanvas(newPos.x,newPos.y) && Global.sprites.player_sprite && !Global.playerDead)
    {
      Global.sprites.player_sprite.position = newPos;
      Global.sprites.player_sprite.setDefaultCollider()
    }

    //check all collisions
    for(let i = allSprites.length - 1; i >= 0; i--)
    {
        let mainSprite = allSprites[i];
        if(!mainSprite) //bailout if we failed to find an object
        {
          continue;
        }
        //tell this sprite to run its waypoint
        runWaypoints(mainSprite);


        //render shields while we are here
        if(mainSprite.hasShield && mainSprite.visible && !mainSprite.removed)
        {
            rectMode(CENTER);
            fill(0,0,0,0);
            stroke(255); //TODO change this to use the sprite's color for the shield
            let radius = Math.max(mainSprite.width*Global.shieldScale,mainSprite.height*Global.shieldScale);
            ellipse(mainSprite.position.x,mainSprite.position.y,radius,radius)
        }


        //iterate through other sprites to check for collisions
        for(let j = allSprites.length - 1; j >= 0; j--)
        {
            let targetSprite = allSprites[j]
            if(!targetSprite)
            {
                continue;
            }

            //so long as they are not the same object and on opposite teams, they can collide
            if(i != j && ((Global.friendlyGroup.contains(mainSprite) && Global.enemyGroup.contains(targetSprite)) ||
                          (Global.friendlyGroup.contains(targetSprite) && Global.enemyGroup.contains(mainSprite)) ))
            {
                let collides = mainSprite.bounce(targetSprite);
                if(collides)
                {

                    let particle_ttl = targetFrameRate*1.5;
                    let particle_count = 10;
                    let particle_color = targetSprite.shapeColor;
                    let particle_size = 3;
                    if(targetSprite.hasShield)
                    {
                       targetSprite.hasShield=false;
                       particle_color=color(255);
                       Global.ParticleSystem.addParticleSpray(mainSprite.position,particle_color,particle_size,particle_ttl,particle_count);
                       if(Global.enemyGroup.contains(targetSprite))
                       {
                          Global.soundMgr.queueSound('enemy_shield_pop');
                       }
                    }
                    else
                    {
                        //both are bullets
                        if(Global.bulletGroup.contains(mainSprite) && Global.bulletGroup.contains(targetSprite))
                        {
                            //two sprays
                            particle_ttl = targetFrameRate/2;
                            particle_count=3;
                            Global.ParticleSystem.addParticleSpray(mainSprite.position,targetSprite.shapeColor,particle_size,particle_ttl,particle_count);
                            Global.ParticleSystem.addParticleSpray(mainSprite.position,mainSprite.shapeColor,particle_size,particle_ttl,particle_count);
                        }
                        else //both are not bullets
                        {
                            Global.ParticleSystem.addParticleSpray(mainSprite.position,targetSprite.shapeColor,particle_size,particle_ttl,particle_count);
                            Global.soundMgr.queueSound('thud');
                        }
                        targetSprite.health -= mainSprite.damage;
                    }
                    if(mainSprite.isPlayerShot)
                    {
                      Global.PlayerShotsHit += 1;
                    }
                }
                if(collides && Global.bulletGroup.contains(mainSprite))
                {
                    mainSprite.remove();
                }
                if(collides && Global.bulletGroup.contains(targetSprite))
                {
                    targetSprite.remove();
                    Global.points += 1; //a point for shooting enemy bullets
                }

            }

          //take care of explosions
          if(targetSprite.health <= 0)
          {
            if(Global.enemyGroup.contains(targetSprite))
            {
              if(targetSprite.point_value)
              {
                Global.points += targetSprite.point_value;
              }
              let newpos = targetSprite.position;
              targetSprite.remove();
              let explode_sprite = createSprite(newpos.x, newpos.y, 16, 16);
              explode_sprite.scale = 3
              explode_sprite.life = targetFrameRate;
              explode_sprite.addAnimation('explode', Global.animations.rotary_explosion);
            }

            if(Global.friendlyGroup.contains(targetSprite) && (!playerInvulnerableDebug && debugMode))
            {
              let newpos = targetSprite.position;
              targetSprite.remove();
              let explode_sprite = createSprite(newpos.x, newpos.y, 16, 16);
              explode_sprite.scale = 3
              explode_sprite.life = targetFrameRate;
              explode_sprite.addAnimation('explode', Global.animations.blue_explosion);

              //whoops, you died
              playerDeathEvents();
            }
          }
        }
    }

    renderForegroundUI();

    //do some one-per-frame sprite management work
    //set the particle color for the sprite, since we can only do that once it's rendered.
    if(allSprites.length > 0)
    {
        let idx = frameCount % allSprites.length
        let spr = allSprites[idx];

        //Check if an enemy sprite needs to be scheduled
        if(Global.enemyShipGroup.contains(spr) && spr.waypoints.length <= 0)
        {
            Global.director.coordinateSpriteWithDiveAttackSchedule(spr);
        }

        //check for colors
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

    Global.director.run();
    Global.waveManager.run();
    Global.textHandler.updateAndRender();

    //play all the sounds we've built up this frame
    Global.soundMgr.playAllQueuedSounds();

    if(false)
    {
      Global.waypointManager._renderMyPoints();
    }

    if(frameDebug)
    {
      //freeze for analysis
      throw 'freeze';
    }
}


function mousePressed()
{
    resumeSoundIfContextBlocked();
    if(!Global.playerDead)
    {
        playerShootEvent();
    }
}

//handles continuous presses
var handleUserInput = function()
{
  if((keyIsDown(32)/*space*/ || mouseIsPressed) && !Global.playerDead)
  {
    playerShootEvent();
  }
};

function keyPressed() {
  if(keyCode == ENTER || keyCode == RETURN)
  {
    reset();
    return;
  }

  resumeSoundIfContextBlocked();

  if(key == 'M' )
  {
      Global.soundMgr.mute = !Global.soundMgr.mute
  }

  if(key == 'S')
  {
    Global.backgroundStars.push(new BackgroundStar(createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight))));
  }


  if(key == 'O' && debugMode == true && Global.sprites.player_sprite)
  {
    let player = Global.sprites.player_sprite;
    if(player.hasShield)
    {
       player.hasShield=false;
       Global.ParticleSystem.addParticleSpray(player.position,color(255),3,20,10);
    }
    else
    {
        Global.ParticleSystem.addParticleSpray(player.position,player.shapeColor,3,20,10);
    }
  }



};

function randomFromInterval(min,max){
    return Math.random()*(max-min+1)+min;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

//true-false coin-flip
function coinFlip()
{
  return (int(Math.random() * 2) == 0);
}

function updateUIstuff()
{
  var fps = frameRate();
  FPSstring = "FPS:" + fps.toFixed(0);

  pointsString = "Points: " + Global.points;
}

function renderBackgroundUI()
{
    textSize(14);
    textStyle(NORMAL);
    textFont('Courier New');
    stroke(Global.backgroundColor);
    fill(Global.textColor);
    text(FPSstring, FPSstringLocation.x,FPSstringLocation.y);
    text(pointsString,pointsStringLocation.x,pointsStringLocation.y);
}

function renderForegroundUI()
{
    if(Global.playerDead)
    {
        textSize(16);
        textStyle(NORMAL);
        textAlign(LEFT);
        textFont('Courier New');
        stroke(Global.backgroundColor);
        fill(Global.textColor);
        text(Game_Over_string , Game_Over_string_location.x,Game_Over_string_location.y);
        let shots_string =      '               Hits:'+Global.PlayerShotsHit + '      ' + 'Fired:'+Global.PlayerShotsTotal
        text(shots_string , Game_Over_shots_location.x,Game_Over_shots_location.y);
        let percentage_string = '               Percentage:'+calculateHitPercentage()+'%'
        text(percentage_string , Game_Over_hit_percent_location.x,Game_Over_hit_percent_location.y);
    }
}

function halfSecondUpdateLoop(){
  updateUIstuff();
}

function preFillBackgroundStars()
{
  while(Global.backgroundStars.length < backgroundStarCount)
  {
    Global.backgroundStars.push(new BackgroundStar());
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
    if(Global.sprites.player_sprite && Global.sprites.player_sprite.GunCooldown.canFire(frameCount) && !Global.sprites.player_sprite.removed)
    {
        Global.sprites.player_sprite.GunCooldown.fire(frameCount);
        Global.PlayerShotsTotal += 1;
        let posx = Global.sprites.player_sprite.position.x;
        let posy = Global.sprites.player_sprite.position.y;
        let h = Global.images.red_bolt.height
        let w = Global.images.red_bolt.width
        let new_bullet = createSprite(posx,posy,h,w);
        new_bullet.addImage(Global.images.red_bolt);
        new_bullet.scale = 3;
        let yvel = -4.5
        new_bullet.setVelocity(0,yvel);
        new_bullet.mass = 0.09;
        new_bullet.damage = 10;
        new_bullet.life = Math.floor(Math.abs(Global.canvasHeight / yvel)+h);
        new_bullet.isPlayerShot = true;
        Global.bulletGroup.add(new_bullet);
        Global.friendlyGroup.add(new_bullet);

        Global.soundMgr.queueSound('player_bullet');
    }
}

function isABrightColor(color)
{
  let minColor = 100;
  return (red(color)+green(color)+blue(color))>minColor;
}

function runWaypoints(spr)
{
    if(spr && spr.waypoints && spr.waypoints.length > 0)
    {
        let currentWaypoint = spr.waypoints[0];
        spr.attractionPoint(spr.baseAccel,currentWaypoint.x,currentWaypoint.y)

        // if we get close enough to the waypoint
        // we will first check to see if the waypoint says to fire and handle that
        // then remove the waypoint so we can go to the next waypoint
        if(dist(spr.position.x,spr.position.y,currentWaypoint.x,currentWaypoint.y) < 4)
        {
            if(currentWaypoint.fire && spr.GunCooldown.canFire(frameCount)) //TODO gunCooldown
            {
                //TODO handle firing at waypoints
                spr.GunCooldown.fire(frameCount);
                fireEnemyBulletStraightDown(spr.position.x,spr.position.y);
            }

            //go to next waypoint
            spr.waypoints.shift();

            //if we are now empty set speed to near 0 so we glide to a stop
            if(spr.waypoints.length <= 0)
            {
                spr.limitSpeed(0.05)
            }
        }
    }
}

function updateAttackAI(spr)
{
    if(spr)
    {
        let newWaypoints = Global.waypointManager.get('bottomCircleRight');
        newWaypoints = Global.waypointManager.markAllWaypointsToAttack(newWaypoints);
        newWaypoints.push(spr.formationPoint);
        spr.waypoints = newWaypoints;
    }
}

function midpoint(x1,y1,x2,y2)
{
    return pointOnLine(x1,y1,x2,y2,0.5);
}

function pointOnLine(x1,y1,x2,y2,fraction)
{
    let newpoint = {x:(x1+x2)*fraction,y:(y1+y2)*fraction}
    return newpoint;
}

function pointOnLineOverPlayer(x1,y1,x2,y2)
{
    if(!Global.sprites.player_sprite)
    {
      return null
    }
    let playerx = Global.sprites.player_sprite.position.x;
    if((playerx < x1 && playerx < x2)||(playerx > x1 && playerx > x2)) //not between the two given points
    {
      return null
    }

    let newpoint = {x:playerx,y:(y1+y2)/2}
    return newpoint;
}


function fireEnemyBulletStraightDown(x,y)
{
  let h = Global.images.cyan_bolt.height
  let w = Global.images.cyan_bolt.width
  let new_bullet = createSprite(x,y,h,w);
  new_bullet.addImage(Global.images.cyan_bolt);
  new_bullet.scale = 3;
  let yvel = 3.5
  new_bullet.setVelocity(0,yvel);
  new_bullet.mass = 0.1;
  new_bullet.damage = 10;
  new_bullet.life = Math.floor(Math.abs(Global.canvasHeight / yvel)+h);
  Global.bulletGroup.add(new_bullet);
  Global.enemyGroup.add(new_bullet);

  Global.soundMgr.queueSound('player_bullet');
}


function resumeSoundIfContextBlocked()
{
  if (getAudioContext().state !== 'running')
  {
        getAudioContext().resume();
  }
}

function startGameMusic()
{
    Global.soundMgr.queueSound('giddyup');
}

function createPlayerSprite()
{
     //create sprite in lower middle of screen,with normal size collision box
    Global.sprites.player_sprite = createSprite(Global.canvasWidth/2,Global.canvasHeight*(5/6),Global.images.player_ship.width,Global.images.player_ship.height)
    Global.sprites.player_sprite.addImage(Global.images.player_ship);
    Global.sprites.player_sprite.scale = 3;
    Global.sprites.player_sprite.setDefaultCollider();
    Global.sprites.player_sprite.health = 5;
    Global.sprites.player_sprite.damage = 20;
    Global.sprites.player_sprite.hasShield = true;
    Global.sprites.player_sprite.GunCooldown = new GunCooldown(targetFrameRate*0.71); //experimentally determined
    if(!playerInvulnerableDebug && debugMode)
    {
        Global.friendlyGroup.add(Global.sprites.player_sprite);
    }
}

function playerDeathEvents()
{
    Global.playerDead = true;
    Global.textColor = color(255,0,0);
    Global.PlayerHitPercent = calculateHitPercentage();
}

function calculateHitPercentage()
{
    if(Global.PlayerShotsTotal <= 0)
    {
      return 0;
    } else {
       return (Global.PlayerShotsHit / Global.PlayerShotsTotal)*100 ;
    }
}