"use strict";
class Particle
{
  constructor(pos,color,size,ttl)
  {
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.pos = pos.copy();
      this.ttl = 90;
      this.color = 255;

      if(color)
      {
          this.color = color;
      }
      if(size)
      {
        this.size = size;
      }
      if(ttl)
      {
        this.ttl = ttl;
      }
      let ttlVariation = 10
      this.ttl = this.ttl + random(-ttlVariation, ttlVariation) //slight variation in particle lifetime
  }

  update()
  {
    if(this.ttl > 0)
    {
        this.ttl--;
        this.pos.add(this.vel);

        if(!onCanvas(this.pos.x,this.pos.y))
        {
            this.ttl=0;
        }
    }
  }

  //render with the size at the position
  render()
  {
    if(this.ttl > 0)
    {
      stroke(this.color);
      strokeWeight(this.size);
      point(this.pos.x,this.pos.y);
    }
  }
}

class ParticleSystem
{
    constructor()
    {
        this._size = 160; //2*80, where 80 is the biggest use of particles at once, and other effects are ~10 particles per burst.
        this._particles =  Array(this._size).fill(null);
        this._nextPos = 0;
    }

    addParticle(pos,color,size,ttl)
    {
      this._particles[this._nextPos] = new Particle(pos,color,size,ttl);
      this._nextPos++;
      if(this._nextPos >= this._size)
      {
        this._nextPos = 0;
      }
    }

    addParticleSpray(pos,color,size,ttl,count)
    {
        if(count)
        {
            for(let i=0;i<count;i++)
            {
                this.addParticle(pos,color,size,ttl);
            }
        }
    }

    run()
    {
       for(let i = 0; i < this._particles.length; i++)
       {
         let p = this._particles[i];
         if(p != null)
         {
           p.update();
           p.render();
         }
       }
    }
}