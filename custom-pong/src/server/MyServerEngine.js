'use strict';

import ServerEngine from 'lance/ServerEngine';
import PlayerAvatar from '../common/PlayerAvatar';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();

        this.players = {
            player1: null,
            player2: null,
            player3: null,
            player4: null
        };
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // attach newly connected player an available paddle
        if (this.players.player1 === null) {
			console.log('Player 1 connected');
			
            //var paddle = new Paddle(this.gameEngine, null, { position: new TwoVector(this.gameEngine.PADDING, 0), playerId: 1 })
            
            this.players.player1 = {'socket_id' : socket.id };
            
            this.gameEngine.addPaddle(socket.playerId, 1);
            
            this.gameEngine.paddle1.playerId = socket.playerId;
            
            
        } else if (this.players.player2 === null) {
			console.log('Player 2 connected');
            
            
            
            this.players.player2 = {'socket_id' : socket.id};
            
            this.gameEngine.addPaddle(socket.playerId, 2);
            
            this.gameEngine.paddle2.playerId = socket.playerId;
        } else if (this.players.player3 === null) {
			console.log('Player 3 connected');
            this.players.player3 = socket.id;
            this.gameEngine.paddle3.playerId = socket.playerId;
        } else if (this.players.player4 === null) {
			console.log('Player 4 connected');
            this.players.player4 = socket.id;
            this.gameEngine.paddle4.playerId = socket.playerId;
        }
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        if (this.players.player1.socket_id == socketId) {
            console.log('Player 1 disconnected');
            
            let playerPaddle = this.gameEngine.world.queryObject({'playerId': playerId});
            if(playerPaddle){
				console.log('Del player 1 paddle');
				this.gameEngine.removeObjectFromWorld(playerPaddle);
			}
            this.players.player1 = null;
        } else if (this.players.player2.socket_id == socketId) {
            console.log('Player 2 disconnected');
            
            let playerPaddle = this.gameEngine.world.queryObject({'playerId': playerId});
            if(playerPaddle){
				console.log('Del player 2 paddle');
				this.gameEngine.removeObjectFromWorld(playerPaddle);
			}
            this.players.player2 = null;
        } else if (this.players.player3.socket_id == socketId) {
            console.log('Player 3 disconnected');
            this.players.player3 = null;
        } else if (this.players.player4.socket_id == socketId) {
            console.log('Player 4 disconnected');
            this.players.player4 = null;
        }
    }
}
