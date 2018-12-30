"use strict";
class DirectorAI
{
    constructor()
    {

    }

    getStage()
    {
        return Global.stage;
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
        if(waveCount <= 0)
        {
            busy=false;
        }
        else
        {

            waveCount--;
        }
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

        if(newSprite && waypointArray)
        {
            for(let i = 0; i< waypointArray.length; i++)
            {
                newSprite.waypoints.pushBack(waypointArray[i]);
            }
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