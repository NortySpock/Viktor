class PlayerShip extends GameObject
{
  constructor()
  {
    super();
    this.pos = createVector(5,5);
  }
  
  update()
  {
    const newPos = p5.Vector.add(this.pos, handleKeyInput());
    if(onCanvas(newPos.x,newPos.y))
    {
      this.pos = newPos 
    }

  }

  render()
  {
    imageMode(CENTER);
    image(Global.images.ship2, this.pos.x, this.pos.y, Global.images.ship2.width*2,Global.images.ship2.height*2);
  }
  
  triggerSound()
  {
    Global.soundMgr.queueSound('test_sound');
  }
}