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
        this.particles = [];
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
        //to reduce memory and CPU thrashing, we're just going to delete off the pop end.
        //this does mean memory usage will grow until all particles are dead
        //but I don't care much at the moment as particles are used sparingly.
        let done = false
        while(this.particles.length > 0 && !done)
        {
            let lastParticle = this.particles[this.particles.length-1]
            if(lastParticle && lastParticle.ttl <= 0)
            {
                this.particles.pop();
            }
            else
            {
                done = true;
            }
        }

       //now that we've tried to cheaply discard some dead particles, run the rest.
       for (let i = 0; i < this.particles.length; i++)
        {
          let p = this.particles[i];
          if(p)
          {
            p.update();
            p.render();
          }
        }
    }
}