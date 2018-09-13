"use strict";
class BackgroundStar
{
  constructor(pos)
  {
    if(pos)
    {
      this.pos = pos;
    } else
    {
      this.pos = createVector(randomFromInterval(0,canvasWidth),0)
    }

    this.minStarSize = 1;
    this.maxStarSize = 3;
    this.minFallSpeed = 1;
    this.maxFallSpeed = 3;

    this.size = randomFromInterval(this.minStarSize,this.maxStarSize);
    this.fallSpeed = randomFromInterval(this.minFallSpeed,this.maxFallSpeed);
  }

  update()
  {
    this.pos.y += this.fallSpeed;

    if(this.pos.y > Game.canvasHeight + 10)
    {
      this.pos.y = -10; //recycle to top
      this.pos.x = randomFromInterval(0,Game.canvasWidth);
    }
  }

  render()
  {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x,this.pos.y);
  }
}