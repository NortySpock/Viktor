"use strict";
class SoundManager
{
    constructor()
    {
        this.soundQueue = []
        this.mute = false;

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
}

