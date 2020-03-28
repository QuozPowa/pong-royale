import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Ball extends PhysicalObject2D {

    static get netScheme() {
        return Object.assign({
            level: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    get bending() {
        return { position: { percent: 1.0 } };
    }

    // on add-to-world, create a physics body
    onAddToWorld() {
        game = this.gameEngine;
        p2 = game.physicsEngine.p2;
        this.physicsObj = new p2.Body({
            mass: 0.1,
            position: [0, 0],
            velocity : [this.velocity.x, this.velocity.y],
            damping: 0,
            angularVelocity: 0
        });

        this.physicsObj.addShape(new p2.Circle({ // Give it a circle shape
            radius: game.ballRadius
        }));
        /*
        this.physicsObj.addShape(new p2.Circle({
            radius: game.asteroidRadius * (game.numAsteroidLevels - this.level) / game.numAsteroidLevels,
            collisionGroup: game.ASTEROID, // Belongs to the ASTEROID group
            collisionMask: game.BULLET | game.SHIP // Can collide with the BULLET or SHIP group
        }));
        */

        game.balls.push(this.physicsObj);

        game.physicsEngine.world.addBody(this.physicsObj);
    }

    // on remove-from-world, remove the physics body
    onRemoveFromWorld() {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }


    syncTo(other) {
        super.syncTo(other);
    }

    toString() {
        return `Asteroid::${super.toString()} Level${this.level}`;
    }
}
