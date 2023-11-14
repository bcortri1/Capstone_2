import * as Tone from 'tone';

//A single path/buffer in Transport
class playBuffer {
    constructor(now, playArr = [], delay = 0){
        this.playArr = playArr;
        this.delay = delay;
        this.now = now;
    }
    //Adds a note player and optionally increases delay
    add(player, delay = 0) {
        this.playArr.push(player)
        this.delay += delay;
        console.debug("buffer",this.playArr)
    }
    //Resets buffer
    //playBuffers arent reused, so code this piece of code is unecessary in current iteration
    clear() {
        this.playArr = [];
        this.delay = 0;
    }
    //Stops all playing notes  in current buffer
    stopAll() {
        this.playArr.forEach((item) => {
            item.releaseAll(Tone.now());
        })
        this.clear();
    }
}

export default playBuffer;