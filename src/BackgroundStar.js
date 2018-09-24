"use strict";
class BackgroundStar extends GameObject
{
  //create a star at a random position
  constructor(pos)
  {
    super(pos);
    this.pos = createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight));


    //set size and fall rate
    this.minStarSize = 1;
    this.maxStarSize = 3;
    this.minFallSpeed = 1;
    this.maxFallSpeed = 3;

    this.size = randomFromInterval(this.minStarSize,this.maxStarSize);
    this.fallSpeed = randomFromInterval(this.minFallSpeed,this.maxFallSpeed);
  }

  //manually make the star fall, because it only falls down
  update()
  {
    this.pos.y += this.fallSpeed;

    //if it falls off the screen, move it back to the top
    if(this.pos.y > Global.canvasHeight + 10)
    {
      this.pos.y = -10; //recycle to top
      this.pos.x = randomFromInterval(0,Global.canvasWidth);
    }
  }

  //render with the size at the position
  render()
  {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x,this.pos.y);
  }
}