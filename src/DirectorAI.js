"use strict";
class DirectorAI
{
    constructor()
    {
      this.timeline = [];
      this.attackObj = {};
      this.waitTTL = 0;
      this.waveScheduled = false;
      this.diveAttackScheduled = false;
      this.diveAttackRandomSkipCount = 0;
      this.diveAttackShipCounter = 0;
      this.diveWaveToggle = false;
      this.diveAttackRandomSkipCountMax = 5;
      this.diveAttackShipCounterMax = 3;
      this.currentDiveAttack = '';
      this.bossFight = false;
      this._setupStages(); //creates the master timeline
    }

    run()
    {
      if(this.waitTTL > 0)
      {
          this.waitTTL--;
      } else
      {
          this.waitTTL += 5;
          return; //we really want to just do this a few times a sec
      }

      //bailout if we find an impossible situation
      if(this.diveAttackScheduled && Global.enemyShipGroup.length==0)
      {
          this.diveAttackScheduled=false;
      }


      //If we're checking for wave, check to see if the next mini-wave is ready
      //i.e. there are other waves,
      if(this.diveWaveToggle)
      {
        if(this.readyForNextStage())
        {
            this.getNextStage()
        }
      }
      else
      {
        //if we've checking for dives, check to see if the next dive is ready
        //i.e. there are enemies in play, we don't have an existing wave running, etc
        if(this.readyForDiveAttack())
        {
          this._setupDive();
        }
      }

      //If we have an attack ready, busy-loop until the waveManager is ready.
      if(this.waveScheduled && !Global.waveManager.isBusy())
      {
          let a = this.attackObj;
          Global.waveManager.waveRequest(a.type,a.count,a.direction,a.timing);

          //bump the waitTTL to give the waveManager some time to generate the wave
          this.waitTTL += 30
          this.waveScheduled = false;
          this.attackObj = null;
      }

      //flip flop so we're only handling one each run
      this.diveWaveToggle = !this.diveWaveToggle;


      if(this._HasThePlayerJustWon())
      {
          wonTheGameEvents();
      }
    }

    readyForNextStage()
    {
        if(this.waitTTL > 0||this.timeline.length == 0||this.diveAttackScheduled||this.waveScheduled)
        {
            return false;
        }

        //If they haven't shot down all the ships yet and the next batch is different from the current batch in the timeline
        if(Global.enemyShipGroup.length > 0 && this.currentBatch != this.timeline[0].batch)
        {
            return false;
        }

        return true;
    }

    readyForDiveAttack()
    {
        if(this.waitTTL > 0||this.diveAttackScheduled||this.waveScheduled||Global.enemyShipGroup.length==0)
        {
            return false;
        }
        return true;
    }

    getNextStage()
    {
        if(this.timeline.length == 0) //nothing to get
        {
            return;
        }

        this.currentBatch = this.timeline[0].batch;
        while(this.timeline.length > 0 && !this.waveScheduled && this.currentBatch == this.timeline[0].batch)
        {
            let next = this.timeline.shift();
            if(next.ttl > this.waitTTL)
            {
                this.waitTTL = next.ttl;
            }

            if(next.attack == 0)
            {
                Global.textHandler.addMessage(next.msg,next.color,next.spot,next.ttl);
            }
            if(next.attack == 1)
            {
                this.attackObj = next;
                this.waveScheduled = true;
            }
            if(typeof next.execRun === "function")
            {
                next.execRun();
            }
        }
    }

    coordinateSpriteWithDiveAttackSchedule(spr)
    {
        if(this.diveAttackScheduled && spr)
        {
            if(this.diveAttackRandomSkipCount > 0)
            {
                this.diveAttackRandomSkipCount--;
            }
            else
            {
                let newAttack = this.currentDiveAttack;
                let newWaypoints = Global.waypointManager.get(newAttack);
                newWaypoints.push(spr.formationPoint);
                spr.waypoints = newWaypoints;

                this.diveAttackShipCounter--;
                if(this.diveAttackShipCounter <= 0)
                {
                  this.diveAttackScheduled = false;
                }
            }
        }
    }

    _setupDive()
    {
        this.diveAttackScheduled = true;
        this.waitTTL += 450;  //arbitrary, gives a bit of time for the dive to complete

        //since we don't want to just have the same few fighters get picked for a dive
        this.diveAttackRandomSkipCount = randomFromInterval(0,this.diveAttackRandomSkipCountMax);
        this.diveAttackShipCounter = randomFromInterval(1,this.diveAttackShipCounterMax);
        if(this.bossFight)
        {
            this.currentDiveAttack = Global.waypointManager.getRandomBossDiveAttackOption();
        }
        else
        {
            this.currentDiveAttack = Global.waypointManager.getRandomDiveAttackOption();
        }
    }

    _setupStages()
    {
      let storyTTL = Global.enableStory ? 300 : 0;
      let waveTTL = 180;
      /*this.timeline.push({batch:1,
                          attack: 0,
                          msg:"Get your ship through the blockade!",
                          color:color('orange'),
                          spot:"top",
                          ttl:storyTTL});
      this.timeline.push({batch:2,
                          ttl:waveTTL,
                          attack:1,
                          count:2,
                          type:'flat',
                          timing:60,
                          direction:'atkBottomLeft'});
      this.timeline.push({batch:2,
                          ttl:waveTTL,
                          attack:1,
                          count:2,
                          type:'flat',
                          timing:60,
                          direction:'atkBottomRight'});

      this.timeline.push({batch:2,
                          ttl:waveTTL,
                          attack:1,
                          count:2,
                          type:'flat',
                          timing:60,
                          direction:'atkBottomLeft'});
      this.timeline.push({batch:3,
                          attack:0,
                          msg:"Another wave off the starboard side!",
                          color:color('orange'),
                          spot:"low",
                          ttl:storyTTL});
    this.timeline.push({batch:4,
                          ttl:waveTTL,
                          attack:1,
                          count:6,
                          type:'flat_shield',
                          timing:60,
                          direction:'atkMidRight'});
    this.timeline.push({batch:5,
                          attack:0,
                          msg:"These ones look different!",
                          color:color('orange'),
                          spot:"top",
                          ttl:storyTTL});
    this.timeline.push({batch:6,
                          ttl:waveTTL,
                          attack:1,
                          count:4,
                          type:'armor',
                          timing:60,
                          direction:'atkMidLeft'});
    this.timeline.push({batch:7,
                          ttl:waveTTL,
                          attack:1,
                          count:8,
                          type:'armor',
                          timing:60,
                          direction:'atkMidRight'});

    this.timeline.push({batch:8,
                          attack:0,
                          msg:"Here they come!",
                          color:color('orange'),
                          spot:"top",
                          ttl:storyTTL});

    this.timeline.push({batch:9,
                          ttl:waveTTL,
                          attack:1,
                          count:7,
                          type:'flat_shield',
                          timing:60,
                          direction:'atkMidRight'});

    this.timeline.push({batch:9,
                          ttl:waveTTL,
                          attack:1,
                          count:7,
                          type:'armor',
                          timing:60,
                          direction:'atkMidLeft'});


    this.timeline.push({batch:9,
                          ttl:waveTTL,
                          attack:1,
                          count:7,
                          type:'flat_shield',
                          timing:60,
                          direction:'atkBottomLeft'});

        this.timeline.push({batch:9,
                          ttl:waveTTL,
                          attack:1,
                          count:7,
                          type:'armor',
                          timing:60,
                          direction:'atkBottomRight'});

       this.timeline.push({batch:10,
                          attack:0,
                          msg:"Uh oh...",
                          color:color('orange'),
                          spot:"top",
                          ttl:storyTTL}); */
      this.timeline.push({batch:11,
                          ttl:waveTTL,
                          attack:1,
                          count:1,
                          type:'boss',
                          timing:60,
                          direction:'topLeft',
                          execRun: function(){Global.director.bossFight = true} });
    }

    _debugTimelineItem(item)
    {
        if(debugMode===true)
        {
            console.log(item)
        }
    }

    _HasThePlayerJustWon()
    {
        if(this.waitTTL > 0 || this.timeline.length > 0 || Global.enemyGroup.length > 0 || Global.playerDead || Global.WonTheGame) //already won
        {
            return false;
        }
        return true;
    }
}

class WaveManager
{
    constructor()
    {
        this.formationPoints=[];

        this.busy=false;
        this.waveCount=0;
        this.waveDirection = '';
        this.waveEnemy = '';
        this.delayTiming = 0;
        this.delay;
        this.fireWarningSpray=false;

        this.createFormationPoints();
    }

    waveRequest(enemy,count,direction,delayTiming)
    {
        if(!this.busy)
        {
            this.busy = true;
            this.waveEnemy = enemy;
            this.waveCount = count;
            this.waveDirection = direction;
            this.delayTiming = delayTiming; //40-60 is probably the best delay timing
            this.delay = delayTiming;
            this.fireWarningSpray = true;
            return true;
        }
        else
        {
            return false;
        }
    }

    convertDirectionToSpawn(enemy,direction)
    {
      let pos = createVector(-1000,-1000); //default to offscreen
      let waypointArray = [];
      let offset = 65;
      switch(direction)
       {
          case 'bottomLeft':
            pos =  createVector(0-offset,Global.canvasHeight+offset);
            waypointArray = Global.waypointManager.get('bottomLeft');
            break;

          case 'atkBottomLeft':
            pos =  createVector(0-offset,Global.canvasHeight+offset);
            waypointArray = Global.waypointManager.get('atkBottomLeft');
            break;

          case 'bottomRight':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight+offset);
            waypointArray = Global.waypointManager.get('bottomRight')
            break;


          case 'atkBottomRight':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight+offset);
            waypointArray = Global.waypointManager.get('atkBottomRight')
            break;

          case 'midLeft':
            pos = createVector(0-offset,Global.canvasHeight/2);
            waypointArray = Global.waypointManager.get('midLeft')
            break;

            case 'atkMidLeft':
            pos = createVector(0-offset,Global.canvasHeight/2);
            waypointArray = Global.waypointManager.get('atkMidLeft')
            break;

          case 'midRight':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight/2);
            waypointArray = Global.waypointManager.get('midRight')
            break;

          case 'atkMidRight':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight/2);
            waypointArray = Global.waypointManager.get('atkMidRight')
            break;

          case 'atkLoopMidRight':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight/2);
            waypointArray = Global.waypointManager.get('atkMidRight').concat()
            break;


          case 'topLeft':
            pos =  createVector(0-offset,0-offset);
            break;

          case 'topRight':
            pos = createVector(Global.canvasWidth+offset,0-offset);
            break;

          default:
              console.log('Spawn Direction not found:'+direction);
       }
      Global.enemyCreator.createEnemy(enemy,pos,waypointArray);
    }

    run()
    {
        //single tick of adding an enemy
        if(this.waveCount <= 0)
        {
            this.busy=false;
        }
        else
        {
            //first, fire the warning shot / spray
            if(this.fireWarningSpray)
            {
              this.fireWarningSpray = false;
              this._warningSpray(this.waveDirection);
            }

            this.delay--;
            //if we have gone through a delay, it's time to create an enemy at the location
            if(this.delay <= 0)
            {
              this.delay = this.delayTiming;
              this.convertDirectionToSpawn(this.waveEnemy,this.waveDirection);
              this.waveCount--;
            }
        }
    }

    _warningSpray(direction)
    {
       let warnColor = color(0, 255, 255);
       let _size = 3;
       let _ttl = 45;
       let _count = 80;
       let pos = createVector(-1000,-1000); //default to offscreen
       switch(direction)
       {
          case 'bottom left':
          case 'bottomLeft':
          case 'atkBottomLeft':
            pos =  createVector(0,Global.canvasHeight);
            break;

          case 'bottom right':
          case 'bottomRight':
          case 'atkBottomRight':
            pos = createVector(Global.canvasWidth,Global.canvasHeight);
            break;

          case 'mid left':
          case 'midLeft':
          case 'atkMidLeft':
          case 'atkmidLeft':
            pos = createVector(0,Global.canvasHeight/2);
            _count=40;
            break;

          case 'mid right':
          case 'midRight':
          case 'atkMidRight':
          case 'atkmidRight':
            pos = createVector(Global.canvasWidth,Global.canvasHeight/2);
            _count=40;
            break;

          case 'top left':
          case 'topLeft':
            pos =  createVector(0,0);
            break;

          case 'top right':
          case 'topRight':
            pos = createVector(Global.canvasWidth,0);
            break;

          default:
              console.log('warning spay location not found:'+direction);
       }
       Global.ParticleSystem.addParticleSpray(pos,warnColor,_size,_ttl,_count);
    }

    isBusy()
    {
        return this.busy;
    }

    _renderMyPoints()
    {
      this._renderArrayOfPoints(this.bottomLeftAngle);
      this._renderArrayOfPoints(this.bottomRightAngle);
    }

    createFormationPoints()
    {
      this.formationPoints = [];

      let buffer = 65;
      let ylevel = buffer
      //first level
      for(let i = buffer; i<Global.canvasWidth-buffer; i+=buffer)
      {
          this.formationPoints.push({x:i,y:ylevel})
      }

      //second level
      ylevel+=buffer;
      let offset = buffer/2;
      for(let i = buffer+offset; i<Global.canvasWidth-buffer-offset; i+=buffer)
      {
          this.formationPoints.push({x:i,y:ylevel});
      }

      // third level
      ylevel+=buffer;
      for(let i = buffer; i<Global.canvasWidth-buffer; i+=buffer)
      {
          this.formationPoints.push({x:i,y:ylevel})
      }
    }

    getFormationPoint()
    {
      if(this.formationPoints.length == 0)
      {
        //console.log("Ran out of formation points!")
        this.createFormationPoints(); //regenerate the formation points and hope
      }
      return this.formationPoints.shift(); //shift gives FIFO behavior
    }

    reset()
    {
        this.createFormationPoints()
    }

    _renderArrayOfPoints(arrayOfPoints)
    {
      stroke(color(0,255,0));
      strokeWeight(3);
      for(let i = 0; i<arrayOfPoints.length;i++)
      {
        point(arrayOfPoints[i].x,arrayOfPoints[i].y);
      }
    }

    _renderFormationPoints()
    {
      this._renderArrayOfPoints(this.formationPoints);
    }
}


class EnemyCreator
{
    createEnemy(type,posObj,waypointArray)
    {
        if(!posObj)
        {
            console.log('failed to create enemy; posObj is missing:'+JSON.stringify(posObj));
            return null;
        }

        let newSprite = null;
        switch(type)
        {
            case 'flat':
                newSprite = this._createDefaultEnemy(posObj);
                this._setFlat(newSprite);
                newSprite.GameObjectName = type;
                break;
            case 'flat_shield':
                newSprite = this._createDefaultEnemy(posObj);
                this._setFlat(newSprite);
                newSprite.hasShield=true;
                newSprite.GameObjectName = type;
                break;
            case 'armor':
                newSprite = this._createDefaultEnemy(posObj);
                this._setArmor(newSprite);
                newSprite.GameObjectName = type;
                break;
            case 'boss':
                newSprite = this._createDefaultEnemy(posObj);
                this._setBoss(newSprite);
                newSprite.GameObjectName = type;
                newSprite.health = 1; //TODO change back from  testing
                break;
            default:
                console.log('enemy type not found:'+type);
        }

        if(newSprite)
        {
          if(waypointArray)
          {
            newSprite.waypoints = this._deepcopy(waypointArray);
          }
          newSprite.waypoints.push(newSprite.formationPoint);
        }
        return newSprite;
    }

    _createDefaultEnemy(posObj)
    {
        let sprite = createSprite ( posObj.x,posObj.y, 10,10);
        sprite.scale = 3;
        sprite.friction = 0.02;
        sprite.health = 5;
        sprite.damage = 5;
        sprite.baseAccel = 0.2;
        sprite.maxSpeed = 2;
        sprite.point_value = 0;
        sprite.hasShield = false;
        sprite.shieldScale = 1.2;
        sprite.waypoints = [];
        Global.enemyGroup.add(sprite);
        Global.enemyShipGroup.add(sprite);
        sprite.formationPoint = Global.waveManager.getFormationPoint();
        return sprite;
    }

    _setFlat(sprite)
    {
        sprite.addImage(Global.images.enemy1);
        sprite.mirrorY(-1);
        sprite.scale = 3;
        sprite.setDefaultCollider();
        sprite.hasShield = false;
        sprite.shieldScale = 1.2;
        sprite.health = 5;
        sprite.damage = 20;
        sprite.baseAccel = 0.3;
        sprite.maxSpeed = 3;
        sprite.point_value = 20;
        sprite.GunCooldown = new GunCooldown(targetFrameRate/3);
        sprite.fire = function (){fireEnemyCyanBulletStraightDown(this.position.x,this.position.y)};
    }

    _setArmor(sprite)
    {
        sprite.addImage(Global.images.armor);
        sprite.scale = 3;
        sprite.setDefaultCollider();
        sprite.hasShield = false;
        sprite.shieldScale = 1.2;
        sprite.health = 25;
        sprite.damage = 20;
        sprite.baseAccel = 0.15;
        sprite.maxSpeed = 2;
        sprite.point_value = 30;
        sprite.GunCooldown = new GunCooldown(targetFrameRate/3);
        sprite.fire = function (){fireShotgunEnemyCyanBubbleInRandomDownDirection(this.position.x,this.position.y)};
    }

    _setBoss(sprite)
    {
        sprite.addAnimation('boss',Global.animations.boss);
        sprite.scale = 3;
        sprite.setDefaultCollider();
        sprite.hasShield = false;
        sprite.shieldScale = 1.2;
        sprite.health = 109; //about 11 hits
        sprite.damage = 100;
        sprite.baseAccel = 0.15;
        sprite.maxSpeed = 2;
        sprite.point_value = 500;
        sprite.GunCooldown = new GunCooldown(5);
        sprite.FireToggle = false;
        sprite.formationPoint = createVector(Global.canvasWidth/2 ,Global.canvasHeight * 1/12);
        sprite.fire = function ()
        {
            this.FireToggle = !this.FireToggle
            if(this.FireToggle)
            {
                let gunoffset = this.position.y + 35
                //Firing 3 on top of each other is going to make it tough to shoot down
                //and more likely to kill you in one hit
                fireBossCannon(this.position.x,gunoffset)
                fireBossCannon(this.position.x,gunoffset)
                fireBossCannon(this.position.x,gunoffset)
            }
            else
            {
                let x = this.position.x;
                let y = this.position.y;

                fireShotgunEnemyCyanBubbleAtDirection(x,y,180);
                if(coinFlip())
                {
                    fireShotgunEnemyCyanBubbleAtDirection(x,y,180+45);
                }
                else
                {
                    fireShotgunEnemyCyanBubbleAtDirection(x,y,180-45);
                }
            }
        };
    }

    _deepcopy(thing)
    {
      return JSON.parse(JSON.stringify(thing));
    }
}

class WaypointManager
{
    get(direction)
    {
      let offset = 65;
      switch(direction)
      {
          case 'bottomLeft': {
            let waypoints = [];
            waypoints.push({x:-offset,y:Global.canvasHeight+offset});
            waypoints.push({x:Global.canvasWidth*0.4,y:Global.canvasHeight*0.6});
            return waypoints;
            break;
            }

          case 'atkBottomLeft':{
            return this.markLastWaypointToAttack(this.get('bottomLeft'));
            break;
            }

          case 'bottomRight': {
            let waypoints = [];
            waypoints.push({x:Global.canvasWidth+offset,y:Global.canvasHeight+offset});
            waypoints.push({x:Global.canvasWidth*0.6,y:Global.canvasHeight*0.6});
            return waypoints;
            break;
          }

          case 'atkBottomRight': {
            return this.markLastWaypointToAttack(this.get('bottomRight'));
            break;
          }

          case 'midLeft': {
            let waypoints = [];
            waypoints.push({x:0-offset,y:Global.canvasHeight*0.5});
            waypoints.push({x:Global.canvasWidth*0.4,y:Global.canvasHeight*0.5});
            return waypoints;
            break;
          }

          case 'atkMidLeft': {
            return this.markLastWaypointToAttack(this.get('midLeft'));
            break;
          }

          case 'midRight': {
            let waypoints = [];
            waypoints.push({x:Global.canvasWidth+offset,y:Global.canvasHeight*0.5});
            waypoints.push({x:Global.canvasWidth*0.6,y:Global.canvasHeight*0.5});
            return waypoints;
            break;
          }

          case 'atkMidRight': {
            return this.markLastWaypointToAttack(this.get('midRight'));
            break;
          }

          case 'bottomCircleLeft': {
            let circleOffset = Global.canvasWidth*0.15;
            let circleCenterX = Global.canvasWidth * 0.25;
            let circleCenterY = Global.canvasHeight * 0.5;
            let waypoints=[];
            waypoints.push({x:circleCenterX,y:circleCenterY-circleOffset});
            waypoints.push({x:circleCenterX+circleOffset,y:circleCenterY});
            waypoints.push({x:circleCenterX,y:circleCenterY+circleOffset});
            waypoints.push({x:circleCenterX-circleOffset,y:circleCenterY});
            return waypoints;
            break;
          }

          case 'atkDirectBottomCircleLeft': {
              return this.markAllWaypointsToAttack(this.get('bottomCircleLeft'));
          }

          case 'bottomCircleCenter': {
            let circleOffset = Global.canvasWidth*0.15;
            let circleCenterX = Global.canvasWidth * 0.5;
            let circleCenterY = Global.canvasHeight * 0.5;
            let waypoints=[];
            waypoints.push({x:circleCenterX,y:circleCenterY-circleOffset});
            waypoints.push({x:circleCenterX+circleOffset,y:circleCenterY});
            waypoints.push({x:circleCenterX,y:circleCenterY+circleOffset});
            waypoints.push({x:circleCenterX-circleOffset,y:circleCenterY});
            return waypoints;
            break;
          }

          case 'atkDirectBottomCircleCenter': {
              return this.markAllWaypointsToAttack(this.get('bottomCircleCenter'));
          }

          case 'bottomCircleRight': {
            let circleOffset = Global.canvasWidth*0.15;
            let circleCenterX = Global.canvasWidth * 0.75;
            let circleCenterY = Global.canvasHeight * 0.5;
            let waypoints=[];
            waypoints.push({x:circleCenterX,y:circleCenterY-circleOffset});
            waypoints.push({x:circleCenterX+circleOffset,y:circleCenterY});
            waypoints.push({x:circleCenterX,y:circleCenterY+circleOffset});
            waypoints.push({x:circleCenterX-circleOffset,y:circleCenterY});
            return waypoints;
            break;
          }

          case 'atkDirectBottomCircleRight': {
              return this.markAllWaypointsToAttack(this.get('bottomCircleRight'));
          }

          case 'backslashBottomLeft':{
              let relOffset = Global.canvasWidth*0.08;
              let centerX = Global.canvasWidth*0.25;
              let centerY = Global.canvasHeight*0.65;
              let waypoints = [];
              waypoints.push({x:centerX-relOffset,y:centerY-relOffset});
              waypoints.push({x:centerX,y:centerY});
              waypoints.push({x:centerX+relOffset,y:centerY+relOffset});
              return waypoints;
              break;
          }

          case 'atkBackslashBottomLeft':{
              return this.markAllWaypointsToAttack(this.get('backslashBottomLeft'));
          }

          case 'backslashBottomRight':{
              let relOffset = Global.canvasWidth*0.08;
              let centerX = Global.canvasWidth*0.75;
              let centerY = Global.canvasHeight*0.65;
              let waypoints = [];
              waypoints.push({x:centerX-relOffset,y:centerY-relOffset});
              waypoints.push({x:centerX,y:centerY});
              waypoints.push({x:centerX+relOffset,y:centerY+relOffset});
              return waypoints;
              break;
          }

          case 'atkBackslashBottomRight':{
              return this.markAllWaypointsToAttack(this.get('backslashBottomRight'));
          }

          case 'backslashTopLeft':{
              let relOffset = Global.canvasWidth*0.08;
              let centerX = Global.canvasWidth*0.25;
              let centerY = Global.canvasHeight*0.25;
              let waypoints = [];
              waypoints.push({x:centerX-relOffset,y:centerY-relOffset});
              waypoints.push({x:centerX,y:centerY});
              waypoints.push({x:centerX+relOffset,y:centerY+relOffset});
              return waypoints;
              break;
          }

          case 'atkBackslashTopLeft':{
              return this.markAllWaypointsToAttack(this.get('backslashTopLeft'));
          }

          case 'backslashTopMid':{
              let relOffset = Global.canvasWidth*0.08;
              let centerX = Global.canvasWidth*0.5;
              let centerY = Global.canvasHeight*0.25;
              let waypoints = [];
              waypoints.push({x:centerX-relOffset,y:centerY-relOffset});
              waypoints.push({x:centerX,y:centerY});
              waypoints.push({x:centerX+relOffset,y:centerY+relOffset});
              return waypoints;
              break;
          }

          case 'atkBackslashTopMid':{
              return this.markAllWaypointsToAttack(this.get('backslashTopMid'));
          }



          case 'backslashTopRight':{
              let relOffset = Global.canvasWidth*0.08;
              let centerX = Global.canvasWidth*0.75;
              let centerY = Global.canvasHeight*0.25;
              let waypoints = [];
              waypoints.push({x:centerX-relOffset,y:centerY-relOffset});
              waypoints.push({x:centerX,y:centerY});
              waypoints.push({x:centerX+relOffset,y:centerY+relOffset});
              return waypoints;
              break;
          }

          case 'atkBackslashTopRight':{
              return this.markAllWaypointsToAttack(this.get('backslashTopRight'));
          }


          default:
            console.log('waypoint type not found:'+direction);
            return [];
      }
    }

    getDiveAttackOptions()
    {
        return ['atkDirectBottomCircleLeft','atkDirectBottomCircleCenter','atkDirectBottomCircleRight','atkBackslashBottomLeft','atkBackslashBottomRight','atkBackslashTopLeft','atkBackslashTopMid','atkBackslashTopRight']
    }

    getRandomDiveAttackOption()
    {
        let atkOptions = this.getDiveAttackOptions();
        let pick = getRandomIntInclusive(0,atkOptions.length-1);
        let waypointValue = atkOptions[pick]
        return waypointValue;
    }

    getRandomBossDiveAttackOption()
    {
        let atkOptions = ['atkBackslashTopLeft','atkBackslashTopMid','atkBackslashTopRight']
        let pick = getRandomIntInclusive(0,atkOptions.length-1);
        let waypointValue = atkOptions[pick]
        return waypointValue;
    }

    //we may have multiple points where we want to mix in attacks, here is where we do that
    interleaveAttacks(arrayOfPoints)
    {
        if(arrayOfPoints == null || arrayOfPoints.length == null || arrayOfPoints.length < 2)
        {
            return arrayOfPoints
        }

        let newArray = [];
        while(arrayOfPoints.length > 0)
        {
           if(arrayOfPoints.length < 2) //done, finish up
           {
               newArray.push(arrayOfPoints.shift());
           }
           else
           {
               let first = arrayOfPoints.shift();
               let second = arrayOfPoints[0];
               //create midpoint as a fire point
               let midpoint = this._midpoint(first.x,first.y,second.x,second.y)
               midpoint.fire = true;

               newArray.push(first);
               newArray.push(midpoint);
           }
        }
        return newArray;
    }

    // if you want simple attacks
    markAllWaypointsToAttack(waypoints)
    {
        if(waypoints == null || waypoints.length == null || waypoints.length <= 0)
        {
            return waypoints
        }

        for(let i = 0; i < waypoints.length; i++)
        {
            if(waypoints[i])
            {
                waypoints[i].fire = true;
            }
        }
        return waypoints;
    }

    markMiddleWaypointsToAttack(waypoints)
    {
        if(waypoints == null || waypoints.length == null || waypoints.length <= 0)
        {
            return waypoints
        }

        for(let i = 1; i < waypoints.length-1; i++)
        {
            if(waypoints[i])
            {
                waypoints[i].fire = true;
            }
        }
        return waypoints;
    }

    markLastWaypointToAttack(waypoints)
    {
        if(waypoints == null || waypoints.length == null || waypoints.length <= 0)
        {
            return waypoints
        }

        waypoints[waypoints.length-1].fire = true;

        return waypoints;
    }

    markFirstWaypointToAttack(waypoints)
    {
        if(waypoints == null || waypoints.length == null || waypoints.length <= 0)
        {
            return waypoints
        }

        waypoints[0].fire = true;

        return waypoints;
    }

    _renderMyPoints()
    {
      this._renderArrayOfPoints(this.get('backslashBottomLeft'), color("HotPink"));
      this._renderArrayOfPoints(this.get('backslashBottomRight'), color("FireBrick"));
      this._renderArrayOfPoints(this.get('backslashTopLeft'), color("LightBlue"));
      this._renderArrayOfPoints(this.get('backslashTopRight'), color("Olive"));
    }

    _renderArrayOfPoints(arrayOfPoints, color)
    {
      stroke(color);
      strokeWeight(3);
      for(let i = 0; i<arrayOfPoints.length;i++)
      {
        point(arrayOfPoints[i].x,arrayOfPoints[i].y);
      }
    }

    _midpoint(x1,y1,x2,y2)
    {
        return this._pointOnLine(x1,y1,x2,y2,0.5);
    }

    _pointOnLine(x1,y1,x2,y2,fraction)
    {
        let newpoint = {x:(x1+x2)*fraction,y:(y1+y2)*fraction}
        return newpoint;
    }

    _deepcopy(thing)
    {
      return JSON.parse(JSON.stringify(thing));
    }

}

class TextHandler
{
  constructor()
  {
    this.msgList=[];
  }

  addMessage(msg,color,spot,ttl)
  {
    if(Global.enableStory == false)
    {
      return; //don't accept messages
    }

    switch(spot)
    {
      case 'top':
      case 'high':
        this.msgList.push({msg:msg, color:color, ttl:ttl, pos:createVector(Global.canvasWidth/2,Global.canvasHeight*(2/6))});
        break;

      case 'mid':
      case 'center':
        this.msgList.push({msg:msg, color:color, ttl:ttl, pos:createVector(Global.canvasWidth/2,Global.canvasHeight*(3/6))});
        break;

      case 'bottom':
      case 'low':
        this.msgList.push({msg:msg, color:color, ttl:ttl, pos:createVector(Global.canvasWidth/2,Global.canvasHeight*(4/6))});
        break;

      default:
          console.log('text spot not found:'+spot);
    }
  }

  updateAndRender()
  {
    textSize(22);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textFont('Palatino');

    if(this.msgList.length > 2)
    {
      console.log("warning, long message list:"+this.msgList.length);
    }
    for(let i = 0; i < this.msgList.length; i++)
    {
      let msg = this.msgList[i];
      if(msg.ttl > 0)
      {
        msg.ttl--;
        stroke(Global.backgroundColor);
        fill(msg.color);
        text(msg.msg,msg.pos.x,msg.pos.y);
      }
    }
    //delete end if it's too old
    if(this.msgList.length > 0 && (this.msgList[0] == null || this.msgList[0].ttl == 0))
    {
      this.msgList.shift();
    }
  }
}
