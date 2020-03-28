import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Ship extends PhysicalObject2D {

    static get netScheme() {
        return Object.assign({
            place: { type: BaseTypes.TYPES.STRING },
            lives: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }

    // no position bending if difference is larger than 4.0 (i.e. wrap beyond bounds),
    // no angular velocity bending, no local angle bending
    get bending() {
        return { position: { percent: 1.0 } };
    }

    onAddToWorld(gameEngine) {
        game = gameEngine;
        p2 = gameEngine.physicsEngine.p2;



        let shape = this.shape = new p2.Circle({ width: 2, height: 0.5, radius: 1 });
        
        this.physicsObj = new p2.Body({
            mass: 1,
            damping: 0.99,
            angularDamping: 0,
            position : [this.position.x, this.position.y],
            angularVelocity: 0,
             fixedRotation: true
        });

        if(this.place === 'left' || this.place === 'right'){
            this.physicsObj.fixedX = true;
        }
        else if(this.place === 'top' || this.place === 'bot'){
            this.physicsObj.fixedY = true;
        }



        this.physicsObj.addShape(shape);

        shape.material = new p2.Material();


        gameEngine.physicsEngine.world.addContactMaterial(new p2.ContactMaterial(shape.material, game.wall_material, {
            restitution: 0.0,
            relaxation: 1e6,
            friction: 0
        }))


        gameEngine.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    toString() {
        return `Ship::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        this.place = other.place;
        this.lives = other.lives;
    }
}
