"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Ball = _interopRequireDefault(require("../common/Ball"));

var _Wall = _interopRequireDefault(require("../common/Wall"));

var _Ship = _interopRequireDefault(require("../common/Ship"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ctx = null;
var game = null;
var canvas = null;
var gameWidth;
var gameHeight;

var AsteroidsRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(AsteroidsRenderer, _Renderer);

  function AsteroidsRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, AsteroidsRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine; // Init canvas element and add it to the DOM

    canvas = document.createElement("CANVAS");
    gameWidth = canvas.width = 300;
    gameHeight = canvas.height = 300;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 0.05;
    ctx.fillStyle = "white";
    return _this;
  }

  _createClass(AsteroidsRenderer, [{
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(AsteroidsRenderer.prototype), "draw", this).call(this, t, dt); // Clear the canvas


      ctx.fillRect(0, 0, gameWidth, gameHeight);
      var results = []; // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.

      ctx.save();
      ctx.translate(gameWidth / 2, gameHeight / 2); // Translate to the center

      game.zoom = gameWidth < gameHeight ? gameWidth / game.gameWidth : gameHeight / game.gameHeight;
      ctx.scale(game.zoom, -game.zoom); // Zoom in and flip y axis
      // Draw all things

      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Ship["default"]) {
          _this2.drawShip(obj.physicsObj);

          results.push({
            'place': obj.place,
            'lives': obj.lives
          });
        } else if (obj instanceof _Ball["default"]) _this2.drawBall(obj.physicsObj);else if (obj instanceof _Wall["default"]) _this2.drawWall(obj.physicsObj);
      });
      this.drawWalls(); // update status and restore

      this.updateStatus();
      ctx.restore();
      this.shows(results);
    }
  }, {
    key: "shows",
    value: function shows(results) {
      var resultdiv = document.getElementById("result");
      resultdiv.innerHTML = "";
      var table = document.createElement('table');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var res = _step.value;
          var tr = document.createElement('tr');
          tr.appendChild(document.createElement('td'));
          tr.appendChild(document.createElement('td'));
          tr.cells[0].appendChild(document.createTextNode(res.place));
          tr.cells[1].appendChild(document.createTextNode(res.lives));
          table.appendChild(tr);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      resultdiv.appendChild(table);
    }
  }, {
    key: "updateStatus",
    value: function updateStatus() {
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
  }, {
    key: "drawShip",
    value: function drawShip(body) {
      ctx.beginPath();
      ctx.arc(body.position[0], body.position[1], body.shapes[0].radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }, {
    key: "drawBall",
    value: function drawBall(ball) {
      ctx.beginPath();
      ctx.arc(ball.position[0], ball.position[1], ball.shapes[0].radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }, {
    key: "drawWalls",
    value: function drawWalls() {
      ctx.beginPath();
      ctx.moveTo(-game.gameWidth / 2, -game.gameHeight / 2);
      ctx.lineTo(game.gameWidth / 2, -game.gameHeight / 2);
      ctx.lineTo(game.gameWidth / 2, game.gameHeight / 2);
      ctx.lineTo(-game.gameWidth / 2, game.gameHeight / 2);
      ctx.lineTo(-game.gameWidth / 2, -game.gameHeight / 2);
      ctx.stroke();
    }
  }, {
    key: "drawWall",
    value: function drawWall(body) {
      /*
      ctx.beginPath();
      ctx.moveTo(-gameWidth / 2, -gameHeight / 2);
      ctx.lineTo(gameWidth / 2, -gameHeight / 2);
      ctx.stroke();
      */
    }
  }]);

  return AsteroidsRenderer;
}(_lanceGg.Renderer);

exports["default"] = AsteroidsRenderer;
//# sourceMappingURL=AsteroidsRenderer.js.map