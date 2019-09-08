"use strict";
class BackgroundStar
{
  //create a star at a random position
  constructor()
  {
    this.pos = createVector(randomFromInterval(0,Global.canvasWidth),randomFromInterval(0,Global.canvasHeight));

    //set size and fall rate
    this.minStarSize = 1;
    this.maxStarSize = 3;
    this.minFallSpeed = 1;
    this.maxFallSpeed = 3;

    this.size = randomFromInterval(this.minStarSize,this.maxStarSize);
    this.fallSpeed = randomFromInterval(this.minFallSpeed,this.maxFallSpeed);
    this.color = color(255);
  }

  //manually make the star fall, because it only falls down
  updateAndRender()
  {
    //update
    this.pos.y += this.fallSpeed;

    //if it falls off the screen, move it back to the top
    if(this.pos.y > Global.canvasHeight + 10)
    {
      this.pos.y = -10; //recycle to top
      this.pos.x = randomFromInterval(0,Global.canvasWidth);
    }

    //render
    stroke(this.color);
    strokeWeight(this.size);
    point(this.pos.x,this.pos.y);
  }
}