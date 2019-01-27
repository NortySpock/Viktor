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
      //search for an open spot
      let nativeDrop = false
      for(let i = 0; i< this.particles.length; i++)
      {
        if(this.particles[i] && this.particles[i].ttl <= 0)
        {
          nativeDrop = true;
          this.particles[i] = new Particle(pos,color,size,ttl);
          break;
        }
      }

      //didn't find it; have to push
      if(!nativeDrop)
      {
        this.particles.push(new Particle(pos,color,size,ttl));
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
        for (let i = this.particles.length-1; i >= 0; i--)
        {
          let p = this.particles[i];
          if(p && p.ttl > 0)
          {
            p.update();
            p.render();
          }
        }
        //slowly shrink the particle array each frame if it's not being used
        let p = this.particles[this.particles.length-1]
        if(p && p.ttl <= 0 )
        {
          this.particles.pop();
        }
    }
}