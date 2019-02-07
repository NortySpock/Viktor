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
    this.pos.add(this.vel);
    this.ttl--;
   }

  //render with the size at the position
  render()
  {
    stroke(this.color);
    strokeWeight(this.size);
    point(this.pos.x,this.pos.y);
  }
}

class ParticleSystem
{
    constructor()
    {
        this.particles =  new Array(200);
    }

    addParticle(pos,color,size,ttl)
    {
      this.particles.push(new Particle(pos,color,size,ttl));
    }

    addParticleSpray(pos,color,size,ttl,count)
    {
        if(count)
        {
            for(let i=0;i<count;i++)
            {
                this.particles.push(new Particle(pos,color,size,ttl));
            }
        }
    }

    run()
    {
        for (let i = this.particles.length-1; i >= 0; i--)
        {
          let p = this.particles[i];
          if(p && p.ttl > 0)
          {
            p.update();
            p.render();
          } else //dead particle or didn't exist
          {
            this.particles.splice(i, 1);
          }

        }
    }
}