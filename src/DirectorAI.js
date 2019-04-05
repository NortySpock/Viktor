"use strict";
class DirectorAI
{
    constructor()
    {
      this.framesToNextWave = 0;
      this.framesUntilNextWave = 60*10;
      this.toggle = true;
      this.enemies_per_stage = 10;
      this.enemies_left_in_this_stage;
    }

    getStage()
    {
        return Global.stage;
    }

    nextStage()
    {
      Global.stage += 1;
      this.enemies_left_in_this_stage = this.enemies_per_stage * Global.stage;
      this.framesToNextWave = 60;
    }

    run()
    {
      this.framesToNextWave--;

      if(this.framesToNextWave  <= 0 )
      {
        if(!Global.waveManager.isBusy() && Global.waveManager.formationPoints.length >= 5 ) //will check each frame until this works
        {
          let waveCount = 5;
          if(this.toggle)
          {
            Global.waveManager.waveRequest('flat',waveCount ,'bottom left',60);
          }
          else
          {
            Global.waveManager.waveRequest('flat_shield',waveCount ,'bottom right',60);
          }
          this.toggle = !this.toggle;
          this.framesToNextWave = this.framesUntilNextWave;
          this.enemies_left_in_this_stage -= waveCount;
        }
      }

      if(this.enemies_left_in_this_stage <= 0)
      {
        this.nextStage();
      }
    }
}

class WaveManager
{
    constructor()
    {
        this.formationPoints=[];

        this.bottomLeftAngle=[];

        this.bottomRightAngle=[];

        this._createOnRamps();


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
          case 'bottom left':
            pos =  createVector(0-offset,Global.canvasHeight+offset);
            waypointArray = this.bottomLeftAngle.slice();
            break;

          case 'bottom right':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight+offset);
            waypointArray = this.bottomRightAngle.slice()
            break;

          case 'mid left':
            pos = createVector(0-offset,Global.canvasHeight/2);
            break;

          case 'mid right':
            pos = createVector(Global.canvasWidth+offset,Global.canvasHeight/2);
            break;

          case 'top left':
            pos =  createVector(0-offset,0-offset);
            break;

          case 'top right':
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
            pos =  createVector(0,Global.canvasHeight);
            break;

          case 'bottom right':
            pos = createVector(Global.canvasWidth,Global.canvasHeight);
            break;

          case 'mid left':
            pos = createVector(0,Global.canvasHeight/2);
            _count=40;
            break;

          case 'mid right':
            pos = createVector(Global.canvasWidth,Global.canvasHeight/2);
            _count=40;
            break;

          case 'top left':
            pos =  createVector(0,0);
            break;

          case 'top right':
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

    _createOnRamps()
    {
      let offset = 65
      this.bottomLeftAngle=[];
      this.bottomLeftAngle.push({x:-offset,y:Global.canvasHeight+offset});
      this.bottomLeftAngle.push({x:Global.canvasWidth*0.4,y:Global.canvasHeight*0.6});

      this.bottomRightAngle=[];
      this.bottomRightAngle.push({x:Global.canvasWidth+offset,y:Global.canvasHeight+offset});
      this.bottomRightAngle.push({x:Global.canvasWidth*0.6,y:Global.canvasHeight*0.6});
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

      //4th level
      ylevel+=buffer;
      offset = buffer/2;
      for(let i = buffer+offset; i<Global.canvasWidth-buffer-offset; i+=buffer)
      {
          this.formationPoints.push({x:i,y:ylevel})
      }
    }

    getFormationPoint()
    {
      if(this.formationPoints.length == 0)
      {
        console.log("ERROR: ran out of formation points!")
        this.createFormationPoints(); //regenerate the formation points and hope
      }
      return this.formationPoints.shift(); //shift gives FIFO behavior
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
    constructor()
    {

    }



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
                break;
            case 'flat_shield':
                newSprite = this._createDefaultEnemy(posObj);
                this._setFlat(newSprite);
                newSprite.hasShield=true;
                break;
            default:
                console.log('enemy type not found:'+type);
        }

        if(newSprite)
        {
          if(waypointArray)
          {
            newSprite.waypoints = JSON.parse(JSON.stringify(waypointArray));
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
        sprite.damage = 20
        sprite.baseAccel = 0.3;
        sprite.maxSpeed = 3;
        sprite.point_value = 10+10;
        sprite.GunCooldown = new GunCooldown(targetFrameRate/2);
    }


}

class WaypointManager
{
    constructor()
    {
        this._bottomLeftAngle=[];
        this._bottomRightAngle=[];
        this._midRightAngle=[];
        this._midLeftAngle=[];
        this._bottomCircleLeft=[];
        this._bottomCircleRight=[];
        this._bottomCircleCenter=[];
        this._generateWaypoints();
    }

    get(direction)
    {
      let waypointArray = [];
      switch(direction)
       {
          case 'bottomLeft':
            waypointArray = this._bottomLeftAngle.slice();
            break;

          case 'bottomRight':
            waypointArray = this._bottomRightAngle.slice()
            break;

          case 'midLeft':
            waypointArray = this._midLeftAngle.slice()
            break;

          case 'midRight':
            waypointArray = this._midRightAngle.slice()
            break;

          case 'topLeft':
            1==0;
            break;

          case 'topRight':
            1==0;
            break;

          case 'bottomCircleLeft':
            waypointArray = this._bottomCircleLeft.slice()
            break;

          case 'bottomCircleRight':
            waypointArray = this._bottomCircleRight.slice()
            break;

          default:
              console.log('waypoint type not found:'+direction);
       }
       return this._deepCopy(waypointArray);
    }

    //we may have multiple points where we want to mix in attacks, here is where we do that
    interleaveAttacks(arrayOfPointsIn)
    {
        let arrayOfPoints = this._deepCopy(arrayOfPointsIn); //don't want to alter the source

        if(arrayOfPoints.length < 2)
        {
            return arrayOfPoints;
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

    markAllWaypointsToAttack(waypointList)
    {
        let newWaypointList = this._deepCopy(waypointList);
        for(let i = 0; i < newWaypointList.length; i++)
        {
            if(newWaypointList[i])
            {
                newWaypointList[i].fire = true;
            }
        }
        return newWaypointList;
    }

    _generateWaypoints()
    {
      let offset = 65
      this._bottomLeftAngle=[];
      this._bottomLeftAngle.push({x:-offset,y:Global.canvasHeight+offset});
      this._bottomLeftAngle.push({x:Global.canvasWidth*0.4,y:Global.canvasHeight*0.6});

      let circleOffset = Global.canvasWidth*0.15;
      let circleCenterX = Global.canvasWidth * 0.25;
      let circleCenterY = Global.canvasHeight * 0.5;
      this._bottomCircleLeft=[];
      this._bottomCircleLeft.push({x:circleCenterX,y:circleCenterY-circleOffset});
      this._bottomCircleLeft.push({x:circleCenterX+circleOffset,y:circleCenterY});
      this._bottomCircleLeft.push({x:circleCenterX,y:circleCenterY+circleOffset});
      this._bottomCircleLeft.push({x:circleCenterX-circleOffset,y:circleCenterY});


      circleOffset = Global.canvasWidth*0.15;
      circleCenterX = Global.canvasWidth * 0.75;
      circleCenterY = Global.canvasHeight * 0.5;
      this._bottomCircleRight=[]
      this._bottomCircleRight.push({x:circleCenterX,y:circleCenterY-circleOffset});
      this._bottomCircleRight.push({x:circleCenterX+circleOffset,y:circleCenterY});
      this._bottomCircleRight.push({x:circleCenterX,y:circleCenterY+circleOffset});
      this._bottomCircleRight.push({x:circleCenterX-circleOffset,y:circleCenterY});


      circleOffset = Global.canvasWidth*0.15;
      circleCenterX = Global.canvasWidth * 0.5;
      circleCenterY = Global.canvasHeight * 0.5;
      this._bottomCircleCenter=[]
      this._bottomCircleCenter.push({x:circleCenterX,y:circleCenterY-circleOffset});
      this._bottomCircleCenter.push({x:circleCenterX+circleOffset,y:circleCenterY});
      this._bottomCircleCenter.push({x:circleCenterX,y:circleCenterY+circleOffset});
      this._bottomCircleCenter.push({x:circleCenterX-circleOffset,y:circleCenterY});

      this._bottomRightAngle=[];
      this._bottomRightAngle.push({x:Global.canvasWidth+offset,y:Global.canvasHeight+offset});
      this._bottomRightAngle.push({x:Global.canvasWidth*0.6,y:Global.canvasHeight*0.6});

      this._midRightAngle=[];
      this._midRightAngle.push({x:Global.canvasWidth+offset,y:Global.canvasHeight*0.5});
      this._midRightAngle.push({x:Global.canvasWidth*0.6,y:Global.canvasHeight*0.5});

      this._midLeftAngle=[];
      this._midLeftAngle.push({x:0-offset,y:Global.canvasHeight*0.5});
      this._midLeftAngle.push({x:Global.canvasWidth*0.4,y:Global.canvasHeight*0.5});
    }

    _deepCopy(waypointArray)
    {
        return JSON.parse(JSON.stringify(waypointArray));
    }
    _renderMyPoints()
    {
      //this._renderArrayOfPoints(this._bottomLeftAngle, color("HotPink"));
      //this._renderArrayOfPoints(this._bottomCircleLeft ,color("FireBrick"));
      this._renderArrayOfPoints(this._bottomCircleRight ,color("LightBlue"));
      this._renderArrayOfPoints(this._bottomCircleCenter ,color("Olive"));

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


}