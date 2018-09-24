class GameObject
{
  //set position and velocity if given
  constructor(pos, vel)
  {
    if(pos)
    {
      //console.assert(pos === typeof createVector(0,0), "position must be a vector");
      this.pos = pos;
    }
    else
    {
      this.pos = createVector(0,0);
    }
    if(vel)
    {
      this.vel = vel;
    }
    else
    {
      this.vel = createVector(0,0);
    }
    this.deleteFlag = false;
  }

  //abstract function
  update()
  {
       throw new Error('You have to implement the method update()!');
  }

  //abstract function
  render()
  {
       throw new Error('You have to implement the method render()!');
  }
}