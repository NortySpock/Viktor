"use strict";
class DirectorAI
{
    constructor()
    {
      this.formationPoints=[];

      this.bottomLeftAngle=[];

      this.bottomRightAngle=[];

      this._createOnRamps();
    }

    getStage()
    {
        return Global.stage;
    }

    nextStage()
    {
        this.createFormationPoints();

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
        return {x:Global.canvasWidth/2,y:Global.canvasHeight/2}; //return a default center point
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

    _renderMyPoints()
    {
      this._renderArrayOfPoints(this.bottomLeftAngle);
      this._renderArrayOfPoints(this.bottomRightAngle);
    }
}

class WaveManager
{
    constructor()
    {
        this.busy=false;
        this.waveCount=0;
        this.waveDirection = '';
        this.waveEnemy = ''
    }

    acceptWaveRequest(enemy,number,direction)
    {
        if(!this.busy)
        {
            this.busy = true;
            this.waveEnemy = enemy;
            this.waveCount = number;
            this.waveDirection = direction;
            return true;
        }
        else
        {
            return false;
        }

    }

    convertDirectionToXYPoint(direction)
    {

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
            this.waveCount--;
        }
    }

    _warningSpray(loc)
    {
       let warnColor = color(0, 255, 255);
       let _size = 3;
       let _ttl = 45;
       let _count = 80;
       let pos = createVector(-1000,-1000); //default to offscreen
       switch(loc)
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
              console.log('warning spay location not found:'+loc);
       }
       Global.ParticleSystem.addParticleSpray(pos,warnColor,_size,_ttl,_count);
    }

    isBusy()
    {
        return this.busy;
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
            default:
                console.log('enemy type not found:'+type);
        }

        if(newSprite)
        {
          if(waypointArray)
          {
              for(let i = 0; i< waypointArray.length; i++)
              {
                  newSprite.waypoints.pushBack(waypointArray[i]);
              }
          }
          newSprite.waypoints.pushBack(newSprite.formationPoint);
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
        sprite.waypoints = new Deque();
        enemyGroup.add(sprite);
        enemyShipGroup.add(sprite);
        sprite.formationPoint = Global.director.getFormationPoint();
        return sprite;
    }

    _setFlat(sprite)
    {
        sprite.addImage(Global.images.enemy1);
        sprite.mirrorY(-1);
        sprite.scale = 3;
        sprite.setDefaultCollider();
        sprite.hasShield = true;
        sprite.shieldScale = 1.2;
        sprite.health = 5;
        sprite.damage = 20
        sprite.baseAccel = 0.2;
        sprite.maxSpeed = 2;
        sprite.point_value = 10+10;
        sprite.GunCooldown = new GunCooldown(targetFrameRate/2);
    }


}