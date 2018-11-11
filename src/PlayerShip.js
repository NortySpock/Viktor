class PlayerShip
{
  constructor()
  {
    this.pos = createVector(400,400);
  }
  
  update()
  {
    const newPos = createVector(mouseX,mouseY);
    if(onCanvas(newPos.x,newPos.y))
    {
      this.pos = newPos 
    }

  }

  render()
  {
    // imageMode(CENTER);
    // image(Global.images.player_ship, this.pos.x, this.pos.y, Global.images.player_ship.width*3,Global.images.player_ship.height*3);
  }
  
  triggerSound()
  {
    Global.soundMgr.queueSound('test_sound');
  }
}