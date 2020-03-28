import { ServerEngine, TwoVector } from 'lance-gg';
import Wall from '../common/Wall';
import Ball from '../common/Ball';

var deleteBall = null;

export default class AsteroidsServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        gameEngine.physicsEngine.world.on('beginContact', this.handleCollision.bind(this));
        this.gameEngine.on('postStep', this.postStepCustom.bind(this));
        //gameEngine.on('shoot', this.shoot.bind(this));
    }

    start() {
        super.start();
        this.gameEngine.addWalls();
        this.gameEngine.addball();
        this.gameEngine.addball();
    }

    // handle a collision on server only
    handleCollision(evt) {

        /*
        // identify the two objects which collided
        let A;
        let B;
        this.gameEngine.world.forEachObject((id, obj) => {
            if (obj.physicsObj === evt.bodyA) A = obj;
            if (obj.physicsObj === evt.bodyB) B = obj;
        });

        // check bullet-asteroid and ship-asteroid collisions
        if (!A || !B) return;
        this.gameEngine.trace.trace(() => `collision between A=${A.toString()}`);
        this.gameEngine.trace.trace(() => `collision and     B=${B.toString()}`);
        if (A instanceof Bullet && B instanceof Asteroid) this.gameEngine.explode(B, A);
        if (B instanceof Bullet && A instanceof Asteroid) this.gameEngine.explode(A, B);
        if (A instanceof Ship && B instanceof Asteroid) this.kill(A);
        if (B instanceof Ship && A instanceof Asteroid) this.kill(B);

        // restart game
        if (this.gameEngine.world.queryObjects({ instanceType: Asteroid }).length === 0) this.gameEngine.addAsteroids();
        */

        let ball = null;

        let A;
        let B;

        this.gameEngine.world.forEachObject((id, obj) => {
            if (obj.physicsObj === evt.bodyA) A = obj;
            if (obj.physicsObj === evt.bodyB) B = obj;
        });

        if (A instanceof Wall && B instanceof Ball) {
            ball = B;
        } else if (B instanceof Wall && A instanceof Ball) {
            ball = A;
        }

        let shipsnb = this.gameEngine.getShipsNb();

        let walls_by_alias = this.gameEngine.walls_by_alias;

        

        if (ball && (shipsnb[0]>0 && (A == walls_by_alias.bot || B == walls_by_alias.bot))) {
           
            deleteBall = ball;
            for(let ship of this.gameEngine.ships['bot']){
                ship.lives--;
            }
        
            
        }

        if (ball && (shipsnb[1]>0 && (A == walls_by_alias.top || B == walls_by_alias.top))) {
            deleteBall = ball;
            for(let ship of this.gameEngine.ships['top']){
                ship.lives--;
            }
        }

        if (ball && (shipsnb[2]>0 && (A == walls_by_alias.left || B == walls_by_alias.left.physicsObj))) {
            
            deleteBall = ball;
            for(let ship of this.gameEngine.ships['left']){
                ship.lives--;
            }
        }

        if (ball && (shipsnb[3]>0 && (A == walls_by_alias.right || B == walls_by_alias.right))) {
            deleteBall = ball;
            for(let ship of this.gameEngine.ships['right']){
                ship.lives--;
            }
        }


    }

    // shooting creates a bullet
    shoot(player) {

        //this.gameEngine.timer.add(this.gameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    }

    // destroy the missile if it still exists
    destroyBullet(bulletId) {
        
        if (this.gameEngine.world.objects[bulletId]) {
            this.gameEngine.trace.trace(() => `bullet[${bulletId}] destroyed`);
            this.gameEngine.removeObjectFromWorld(bulletId);
        }
    }

    kill(ship) {
        if(ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }

    postStepCustom(stepNumber, isReenact){


        if(deleteBall){
            this.gameEngine.removeObjectFromWorld(deleteBall);
            this.gameEngine.addball();
            deleteBall = null;
        }

    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.gameEngine.addShip(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of this.gameEngine.world.queryObjects({ playerId }))
            this.gameEngine.removeObjectFromWorld(o.id);
    }
}
