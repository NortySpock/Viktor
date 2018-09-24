"use strict";
class BackgroundStar extends GameObject
{
  constructor(pos)
  {
    super(pos);
    this.pos = createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight));
    

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

    if(this.pos.y > Global.canvasHeight + 10)
    {
      this.pos.y = -10; //recycle to top
      this.pos.x = randomFromInterval(0,Global.canvasWidth);
    }
  }

  render()
  {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x,this.pos.y);
  }
}