"use strict";
class Particle
{
  constructor(pos,color,size,ttl)
  {
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.pos = pos.copy();
      this.ttl = 60;
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
        this.particles = [];
    }

    addParticle(pos,color,size)
    {
      this.particles.push(new Particle(pos,color,size));
    }

    addParticleSwarm(pos,color,size,count)
    {
        if(count)
        {
            for(let i=0;i<count;i++)
            {
                this.addParticle(pos,color,size);
            }
        }
    }

    run()
    {
        for (var i = this.particles.length-1; i >= 0; i--)
        {
            var p = this.particles[i];
            p.update();
            p.render();

            if (p.ttl <= 0)
            {
                this.particles.splice(i, 1);
            }
        }
    }
}