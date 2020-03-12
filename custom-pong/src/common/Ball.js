'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Ball extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Ball;
        this.velocity.set(2, 2);
    }

    // turn off bending on velocity (gradual error correction),
    // because the ball flips velocity as it bounces off the wall
    get bending() {
        return { velocity: { percent: 0.0 } };
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'ball');
        }
    }
}
