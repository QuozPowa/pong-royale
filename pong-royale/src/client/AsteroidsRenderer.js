import { Renderer } from 'lance-gg';
import Ball from '../common/Ball';
import Wall from '../common/Wall';
import Ship from '../common/Ship';

let ctx = null;
let game = null;
let canvas = null;

let gameWidth;
let gameHeight;

export default class AsteroidsRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;

        // Init canvas element and add it to the DOM
        canvas = document.createElement("CANVAS");
        gameWidth = canvas.width = 300;
        gameHeight = canvas.height = 300;
        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d");
        ctx.lineWidth = 0.05;
        ctx.fillStyle = "white";
    }

    draw(t, dt) {
        super.draw(t, dt);

        // Clear the canvas
        ctx.fillRect(0, 0, gameWidth, gameHeight);

        var results = [];
        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        ctx.save();
        ctx.translate(gameWidth / 2, gameHeight / 2); // Translate to the center
        game.zoom = gameWidth < gameHeight ? gameWidth / game.gameWidth : gameHeight / game.gameHeight;
        ctx.scale(game.zoom, -game.zoom);  // Zoom in and flip y axis

        // Draw all things

        game.world.forEachObject((id, obj) => {
            if (obj instanceof Ship) {
                this.drawShip(obj.physicsObj);
                results.push({ 'place': obj.place, 'lives': obj.lives });
            }
            else if (obj instanceof Ball) this.drawBall(obj.physicsObj);
            else if (obj instanceof Wall) this.drawWall(obj.physicsObj);
        });
        this.drawWalls();

        // update status and restore
        this.updateStatus();
        ctx.restore();
        this.shows(results);
    }

    shows(results) {
        let resultdiv = document.getElementById("result");
        resultdiv.innerHTML = "";
        let table = document.createElement('table');
        for (let res of results) {
            var tr = document.createElement('tr');

            tr.appendChild(document.createElement('td'));
            tr.appendChild(document.createElement('td'));

            tr.cells[0].appendChild(document.createTextNode(res.place))
            tr.cells[1].appendChild(document.createTextNode(res.lives));

            table.appendChild(tr);
        }
        resultdiv.appendChild(table);
    }

    updateStatus() {

        /*
        let playerShip = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });

        if (!playerShip) {
            if (this.lives !== undefined)
                document.getElementById('gameover').classList.remove('hidden');
            return;
        }

        // update lives if necessary
        if (playerShip.playerId === this.gameEngine.playerId && this.lives !== playerShip.lives) {
            document.getElementById('lives').innerHTML = 'Lives ' + playerShip.lives;
            this.lives = playerShip.lives;
        }
        */

    }

    drawShip(body) {

        ctx.beginPath();
        ctx.arc(
            body.position[0],
            body.position[1],
            body.shapes[0].radius,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();

    }


    drawBall(ball) {

        ctx.beginPath();
        ctx.arc(
            ball.position[0],
            ball.position[1],
            ball.shapes[0].radius,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();
    }

    drawWalls() {
        ctx.beginPath();
        ctx.moveTo(-game.gameWidth / 2, -game.gameHeight / 2);
        ctx.lineTo(game.gameWidth / 2, -game.gameHeight / 2);
        ctx.lineTo(game.gameWidth / 2, game.gameHeight / 2);
        ctx.lineTo(-game.gameWidth / 2, game.gameHeight / 2);
        ctx.lineTo(-game.gameWidth / 2, -game.gameHeight / 2);
        ctx.stroke();
    }

    drawWall(body) {
        /*
        ctx.beginPath();
        ctx.moveTo(-gameWidth / 2, -gameHeight / 2);
        ctx.lineTo(gameWidth / 2, -gameHeight / 2);
        ctx.stroke();
        */
    }

}
