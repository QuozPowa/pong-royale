import { ClientEngine, KeyboardControls } from 'lance-gg';
import AsteroidsRenderer from '../client/AsteroidsRenderer';

const betaTiltThreshold = 40;
const gammaTiltThreshold = 40;
const steerThreshold = 0.4;
var Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

export default class AsteroidsClientEngine extends ClientEngine {
 


    
    onKeyUp(e) {

        var kc = e.keyCode;
        if (kc === 37) Keys.left = false;  // only one key per event
        else if (kc === 38) Keys.up = false;    // so check exclusively
        else if (kc === 39) Keys.right = false;
        else if (kc === 40) Keys.down = false;
        this.sendInput("updateKeys", {Keys});
    }



    onKeyDown(e) {
        var kc = e.keyCode;
        if (kc === 37) Keys.left = true;  // only one key per event
        else if (kc === 38) Keys.up = true;    // so check exclusively
        else if (kc === 39) Keys.right = true;
        else if (kc === 40) Keys.down = true;
        this.sendInput("updateKeys", {Keys});
    }

    constructor(gameEngine, options) {


     
        super(gameEngine, options, AsteroidsRenderer);

        document.body.addEventListener('keyup', this.onKeyUp.bind(this));

        document.body.addEventListener('keydown', this.onKeyDown.bind(this));

        
        
    }

    // our pre-step is to process inputs that are "currently pressed" during the game step
    preStep() {
    }

}

