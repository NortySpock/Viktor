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

        this.playerShieldPopNoise = new p5.Noise();
        this.playerShieldPopNoise.setType('pink');
        this.playerShieldPopNoise.amp(0);
        this.playerShieldPopNoise.start()

        this.playerShieldPopEnvelope = new p5.Env()
        // set attackTime, decayTime, sustainRatio, releaseTime
        this.playerShieldPopEnvelope.setADSR(0.001,0.15,0.2,0.05);


        this.enemyShieldPopNoise = new p5.Noise();
        this.enemyShieldPopNoise.setType('brown');
        this.enemyShieldPopNoise.amp(0);
        this.enemyShieldPopNoise.start()

        this.enemyShieldPopEnvelope = new p5.Env()
        // set attackTime, decayTime, sustainRatio, releaseTime
        this.enemyShieldPopEnvelope.setADSR(0.01,0.15,0.2,0.1);
        let attackLevel = 0.3
        let releaseLevel = 0;
        this.enemyShieldPopEnvelope.setRange(attackLevel,releaseLevel);
    }

    queueSound(sound)
    {
        this.soundQueue.push(sound);
    }

    playAllQueuedSounds()
    {
        if(this.mute)
        {
            this.soundQueue = []; //clear queue from the last frame
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

          case 'player_shield_pop':
            this.playerShieldPopEnvelope.play(this.playerShieldPopNoise);
            break;

          case 'enemy_shield_pop':
            this.enemyShieldPopEnvelope.play(this.enemyShieldPopNoise);
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

    boss_one_Music()
    {
      (function () {
        let a = new AudioContext
        let G=a.createGain()
        let D = [];
        for(let i in D=[24,25,,,25,24,,,24,,,24,,,24,25,24,25,24,25])
        {
          let o = a.createOscillator()
          if(D[i])
          {
              o.connect(G)
              G.connect(a.destination)
              o.start(i*.2)
              o.frequency.setValueAtTime(440*1.06**(13-D[i]),i*.2)

              G.gain.setValueAtTime(1,i*.2)
              G.gain.setTargetAtTime(.0001,i*.2+.18,.005)
              o.stop(i*.2+.19);
          }
        }

        })();

    }


    boss_two_music()
    {
      (function () {
        let a = new AudioContext
        let G=a.createGain()
        let D = [];
        for(let i in D=[22,22,,,23,23,,,24,24,,,25,25])
        {
          let o = a.createOscillator()
          if(D[i])
          {
              o.connect(G)
              G.connect(a.destination)
              o.start(i*.2)
              o.frequency.setValueAtTime(440*1.06**(13-D[i]),i*.2)

              G.gain.setValueAtTime(1,i*.2)
              G.gain.setTargetAtTime(.0001,i*.2+.18,.005)
              o.stop(i*.2+.19);
          }
        }

        })();


    }
}

