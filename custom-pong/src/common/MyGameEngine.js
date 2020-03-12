'use strict';

import TwoVector from 'lance/serialize/TwoVector';
import Paddle from './Paddle';
import Ball from './Ball';
const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(Paddle);
        serializer.registerClass(Ball);
    }

    start() {

        super.start();

        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('objectAdded', (object) => {
			
			console.log(object);
			
            if (object.class === Ball) {
                this.ball = object;
            } else if (object.localNum === 1) {
                this.paddle1 = object;
            } else if (object.localNum === 2) {
                this.paddle2 = object;
            } else if (object.localNum === 3) {
                this.paddle3 = object;
            } else if (object.localNum === 4) {
                this.paddle4 = object;
            }
        });
    }

    initGame() {

        /*
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(PADDING, 0), playerId: 3 }));
        this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(0, HEIGHT - PADDING ), playerId: 4 }));
        */
        
        
        
        this.addObjectToWorld(new Ball(this, null, { position: new TwoVector(WIDTH /2, HEIGHT / 2) }));
    }
    
   addPaddle(playerId, localNum){
	   
		if(localNum == 1){
			this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(PADDING, 0), playerId: playerId, localNum : localNum }));
		}
		if(localNum == 2){
			this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(WIDTH - PADDING, 0), playerId: playerId, localNum : localNum }));
		}
		console.log(this.world.objects);
   }

    postStepHandleBall() {
        if (!this.ball)
            return;

        // CHECK LEFT EDGE:
        if (this.paddle1 && this.ball.position.x <= PADDING + PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle1.y && this.ball.position.y <= this.paddle1.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x < 0) {

            // ball moving left hit player 1 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = PADDING + PADDLE_WIDTH + 1;
        } else if (this.ball.position.x <= 0) {

            // ball hit left wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH/2;
            this.ball.position.y = HEIGHT/2;
            
            //console.log(`player 2 scored`);
        }

        // CHECK RIGHT EDGE:
        if (this.paddle2 && this.ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle2.position.y && this.ball.position.y <= this.paddle2.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x > 0) {

            // ball moving right hits player 2 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
        } else if (this.ball.position.x >= WIDTH ) {

            // ball hit right wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH / 2;
            this.ball.position.y = HEIGHT / 2;
            
            //console.log(`player 1 scored`);
        }

        // ball hits top
        if (this.ball.position.y <= 0) {
            this.ball.position.y = 1;
            this.ball.velocity.y *= -1;
        } else if (this.ball.position.y >= HEIGHT) {
            // ball hits bottom
            this.ball.position.y = HEIGHT - 1;
            this.ball.velocity.y *= -1;
        }

    }

    processInput(inputData, playerId) {

		//console.log('input '+playerId);

        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        let playerPaddle = this.world.queryObject({ playerId });
        
        
        if (playerPaddle) {
			if(playerPaddle.localNum == 1 || playerPaddle.localNum == 2)
			{
				if (inputData.input === 'up') {
					playerPaddle.position.y -= 5;
				} else if (inputData.input === 'down') {
					playerPaddle.position.y += 5;
				}
			
			
			}
			if(playerPaddle.localNum == 3 || playerPaddle.localNum == 4)
			{
				if (inputData.input === 'left') {
					playerPaddle.position.x -= 5;
				} else if (inputData.input === 'right') {
					playerPaddle.position.x += 5;
				}
			}
        }
    }
}
