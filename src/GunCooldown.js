"use strict";
class GunCooldown
{
  //set number of frames this needs to cool down
  constructor(frameCooldown)
  {
    //set size and fall rate
    this.minCooldown = frameCooldown;
    this.lastFiredFrame = 0;
  }

  canFire(currentFrame)
  {
    if(currentFrame >=  (this.lastFiredFrame+this.minCooldown))
    {
        return true;
    }    
    return false;
  }
  
  fire(currentFrame)
  {
      this.lastFiredFrame = currentFrame;
  }  
}