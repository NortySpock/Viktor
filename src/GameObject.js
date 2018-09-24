class GameObject 
{
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
  }
  
  update()
  {    
       throw new Error('You have to implement the method update()!');
  }
  
  render()
  {    
       throw new Error('You have to implement the method render()!');
  }
}