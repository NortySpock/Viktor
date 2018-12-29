"use strict";
class SoundManager
{
    constructor()
    {
        this.soundQueue = []
        this.mute = false;

        this.playerShootOscillator = new p5.Oscillator();
        this.playerShootOscillator.freq(343.849);
        this.playerShootOscillator.amp(0);
        this.playerShootOscillator.start();

        this.playerShootEnvelope = new p5.Env();
        this.playerShootEnvelope.setADSR(0.001, 0.02, 0.05, 0.05);



        this.thudOscillator = new p5.Oscillator();
        this.thudOscillator.freq(110.62);
        this.thudOscillator.amp(0);
        this.thudOscillator.start();

        this.thudEnvelope = new p5.Env();
        this.thudEnvelope.setADSR(0.005, 0.07, 1, 0.005);
    }

    queueSound(sound)
    {
        this.soundQueue.push(sound);
    }

    playAllQueuedSounds()
    {
        if(this.mute)
        {
            this.soundQueue = []; //clear queue
        }
        else
        {
            let previousSound = '';
            while(this.soundQueue.length > 0)
            {
                let currentSound = this.soundQueue.pop()
                //cheap trick to try to avoid repeating sounds
                if(previousSound==currentSound)
                {
                    continue;
                }
                this.playSound(currentSound);
                previousSound = currentSound;
            }
        }
    }

    playSound(sound)
    {
        switch(sound)
        {
          case 'player_bullet':
            this.playerShootEnvelope.play(this.playerShootOscillator);
            break;

          case 'thud':
            this.thudEnvelope.play(this.thudOscillator);
            break;

          case 'giddyup':
            this.giddyupMusic()
            break;

          default:
              console.log('Sound not found:'+sound);
        }
    }

    mute()
    {
        this.mute = true;
    }

    unmute()
    {
        this.mute = false;
    }

    giddyupMusic()
    {
        (function () {
          let a = new AudioContext
          let G=a.createGain()
          let D = [];
          for(let i in D=[25,24,,25,24,,25,24,21])
          {
            let o = a.createOscillator()
            if(D[i])
            {
                o.connect(G)
                G.connect(a.destination)
                o.start(i*.1)
                o.frequency.setValueAtTime(440*1.06**(13-D[i]),i*.1)

                G.gain.setValueAtTime(1,i*.1)
                G.gain.setTargetAtTime(.0001,i*.1+.08,.005)
                o.stop(i*.1+.09);
            }
          }

        })();


    }
}

