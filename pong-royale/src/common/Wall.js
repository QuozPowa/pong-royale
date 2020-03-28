import { PhysicalObject2D } from 'lance-gg';

let game = null;
let p2 = null;

export default class Wall extends PhysicalObject2D {

    onAddToWorld() {
        game = this.gameEngine;
        p2 = game.physicsEngine.p2;

        console.log(this.position);

        this.physicsObj = new p2.Body({
            position: [this.position.x, this.position.y],
            angle: this.angle
        });
        let shape = new p2.Plane();

        shape.material = game.wall_material;
        this.physicsObj.addShape(shape);
        game.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    syncTo(other) {
        super.syncTo(other);
    }

    toString() {
        return `Bullet::${super.toString()}`;
    }
}
