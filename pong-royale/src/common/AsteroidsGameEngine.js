import { GameEngine, P2PhysicsEngine, TwoVector } from 'lance-gg';
import Ball from './Ball';
import Ship from './Ship';
import Wall from './Wall';

var players_keys = {};

export default class AsteroidsGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        // create physics with no friction; wrap positions after each step
        this.physicsEngine = new P2PhysicsEngine({ gameEngine: this });
        let world = this.physicsEngine.world;
        world.defaultContactMaterial.friction = 0;
        world.defaultContactMaterial.restitution = 1;
        world.gravity = [0, 0];

        let p2 = this.physicsEngine.p2;

        var wall_material = new p2.Material();

        this.on('preStep', this.preStepCustom.bind(this));
        this.on('postStep', this.postStepCustom.bind(this));
        
        // game variables
        Object.assign(this, { gameWidth: 8,
             ships: { 'bot': [], 'top': [], 'left': [], 'right': [] },
              lives: 30, gameHeight: 8, maxAsteroidSpeed: 0.25, walls_by_alias: {},
               balls: [], ballRadius: 0.1, wall_material });





    }

    // If the body is out of space bounds, warp it to the other side
    warpAll() {
    }

    addWalls() {
        let walls_by_alias = {};
        let w_bot = new Wall(this, {}, {
            position: new TwoVector(0, -this.gameHeight / 2),
            angle: 0
        });
        this.addObjectToWorld(w_bot);
        walls_by_alias.bot = w_bot;

        let w_top = new Wall(this, {}, {
            position: new TwoVector(0, this.gameHeight / 2),
            angle: Math.PI
        });// Top
        this.addObjectToWorld(w_top);
        walls_by_alias.top = w_top;

        let w_left = new Wall(this, {}, {
            position: new TwoVector(-this.gameWidth / 2, 0),
            angle: -Math.PI / 2
        });// Left
        this.addObjectToWorld(w_left);
        walls_by_alias.left = w_left;

        let w_right = new Wall(this, {}, {
            position: new TwoVector(this.gameWidth / 2, 0),
            angle: Math.PI / 2
        }); // Right
        this.addObjectToWorld(w_right);
        walls_by_alias.right = w_right;

        this.walls_by_alias = walls_by_alias;
    }

    registerClasses(serializer) {
        serializer.registerClass(Ship);
        serializer.registerClass(Ball);
        serializer.registerClass(Wall);
    }

    maxSpeed(p2Body, maxSpeed) {
        var x = p2Body.velocity.x;
        var y = p2Body.velocity.y;

        
        if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(maxSpeed, 2)) {
            var a = Math.atan2(y, x);
            x = -1 * Math.cos(a) * maxSpeed;
            y = -1 * Math.sin(a) * maxSpeed;
            p2Body.velocity.x = x;
            p2Body.velocity.y = y;
        }
        
        return p2Body;
    }

    preStepCustom(stepNumber, isReenact) {
       


        for (let playerId of Object.keys(players_keys)) {


            // handle keyboard presses
            let playerShip = this.world.queryObject({ playerId: parseInt(playerId), instanceType: Ship });


            if (playerShip) {

                let Keys = players_keys[playerId];

                let power = 1;

                if (playerShip.place === 'top' || playerShip.place === 'bot') {
                    if (Keys.right) {
                        let impulse = [power, 0];
                        playerShip.physicsObj.applyImpulse(impulse);

                    }
                    if (Keys.left) {
                        let impulse = [power * (-1), 0];
                        playerShip.physicsObj.applyImpulse(impulse);

                    }
                }


                if (playerShip.place === 'left' || playerShip.place === 'right') {
                    if (Keys.up) {
                        let impulse = [0, power];
                        playerShip.physicsObj.applyImpulse(impulse);

                    }
                    if (Keys.down) {
                        let impulse = [0, power * (-1)];
                        playerShip.physicsObj.applyImpulse(impulse);

                    }
                }

                //this.emit('shoot', playerShip);
                playerShip.refreshFromPhysics();
            }

        }
    }



    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        if (inputData.input === 'updateKeys') {
            let Keys = inputData.options.Keys;
            players_keys[playerId] = Keys;
        }


    }

    // returns a random number between -0.5 and 0.5
    rand() {
        let randnum = Math.random() * 2;
        return Math.round(randnum);
    }

    getShipsNb() {
        let ships = this.world.queryObjects({ instanceType: Ship });



        let shipsnb = [0, 0, 0, 0]
        for (let ship of ships) {
            if (ship.place === 'bot') {
                shipsnb[0]++;
            } else if (ship.place === 'top') {
                shipsnb[1]++;
            } else if (ship.place === 'left') {
                shipsnb[2]++;
            } else if (ship.place === 'right') {
                shipsnb[3]++;
            }
        }
        return shipsnb;
    }

    // create ship
    addShip(playerId) {



        let shipsnb = this.getShipsNb();

        let position = null;
        let place = null;
        if (shipsnb[0] === 0) {
            position = new TwoVector(0, -this.gameWidth / 2);
            place = 'bot';
        } else if (shipsnb[1] === 0) {
            position = new TwoVector(0, this.gameWidth / 2);
            place = 'top';
        } else if (shipsnb[2] === 0) {
            position = new TwoVector(-this.gameWidth / 2, 0);
            place = 'left';
        } else if (shipsnb[3] === 0) {
            position = new TwoVector(this.gameWidth / 2, 0);
            place = 'right';
        }
        let s = new Ship(this, {}, {
            playerId: playerId,
            position: position
        });
        this.ships[place].push(s);
        s.place = place;
        s.lives = this.lives;
        this.addObjectToWorld(s);

    }

    // create asteroids
    addball() {
        let randvx = this.rand();

        let vx;

        if (randvx === 0) {
            vx = (-1) * this.maxAsteroidSpeed;
        } else if (randvx === 1) {
            vx = this.maxAsteroidSpeed;
        } else if (randvx === 2) {
            vx = 0;
        }
        let randvy = this.rand();
        let vy = this.maxAsteroidSpeed;
        if (randvy === 0) {
            vy = (-1) * this.maxAsteroidSpeed;
        } else if (randvy === 1) {
            vy = this.maxAsteroidSpeed;
        } else if (randvy === 2 && !vx === 0) {
            vy = 0;
        }

        console.log(vx);
        console.log(vy);

        // Create asteroid Body
        let a = new Ball(this, {}, {
        });
        this.addObjectToWorld(a);
        a.physicsObj.applyImpulse([vx, vy]);
    }


}

