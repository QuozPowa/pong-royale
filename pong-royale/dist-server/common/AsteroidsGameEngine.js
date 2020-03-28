"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Ball = _interopRequireDefault(require("./Ball"));

var _Ship = _interopRequireDefault(require("./Ship"));

var _Wall = _interopRequireDefault(require("./Wall"));

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

var players_keys = {};

var AsteroidsGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(AsteroidsGameEngine, _GameEngine);

  function AsteroidsGameEngine(options) {
    var _this;

    _classCallCheck(this, AsteroidsGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsGameEngine).call(this, options)); // create physics with no friction; wrap positions after each step

    _this.physicsEngine = new _lanceGg.P2PhysicsEngine({
      gameEngine: _assertThisInitialized(_this)
    });
    var world = _this.physicsEngine.world;
    world.defaultContactMaterial.friction = 0;
    world.defaultContactMaterial.restitution = 1;
    world.gravity = [0, 0];
    var p2 = _this.physicsEngine.p2;
    var wall_material = new p2.Material();

    _this.on('preStep', _this.preStepCustom.bind(_assertThisInitialized(_this)));

    _this.on('postStep', _this.postStepCustom.bind(_assertThisInitialized(_this))); // game variables


    Object.assign(_assertThisInitialized(_this), {
      gameWidth: 8,
      ships: {
        'bot': [],
        'top': [],
        'left': [],
        'right': []
      },
      lives: 30,
      gameHeight: 8,
      maxAsteroidSpeed: 0.25,
      walls_by_alias: {},
      balls: [],
      ballRadius: 0.1,
      wall_material: wall_material
    });
    return _this;
  } // If the body is out of space bounds, warp it to the other side


  _createClass(AsteroidsGameEngine, [{
    key: "warpAll",
    value: function warpAll() {}
  }, {
    key: "addWalls",
    value: function addWalls() {
      var walls_by_alias = {};
      var w_bot = new _Wall["default"](this, {}, {
        position: new _lanceGg.TwoVector(0, -this.gameHeight / 2),
        angle: 0
      });
      this.addObjectToWorld(w_bot);
      walls_by_alias.bot = w_bot;
      var w_top = new _Wall["default"](this, {}, {
        position: new _lanceGg.TwoVector(0, this.gameHeight / 2),
        angle: Math.PI
      }); // Top

      this.addObjectToWorld(w_top);
      walls_by_alias.top = w_top;
      var w_left = new _Wall["default"](this, {}, {
        position: new _lanceGg.TwoVector(-this.gameWidth / 2, 0),
        angle: -Math.PI / 2
      }); // Left

      this.addObjectToWorld(w_left);
      walls_by_alias.left = w_left;
      var w_right = new _Wall["default"](this, {}, {
        position: new _lanceGg.TwoVector(this.gameWidth / 2, 0),
        angle: Math.PI / 2
      }); // Right

      this.addObjectToWorld(w_right);
      walls_by_alias.right = w_right;
      this.walls_by_alias = walls_by_alias;
    }
  }, {
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Ship["default"]);
      serializer.registerClass(_Ball["default"]);
      serializer.registerClass(_Wall["default"]);
    }
  }, {
    key: "maxSpeed",
    value: function maxSpeed(p2Body, _maxSpeed) {
      var x = p2Body.velocity.x;
      var y = p2Body.velocity.y;

      if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(_maxSpeed, 2)) {
        var a = Math.atan2(y, x);
        x = -1 * Math.cos(a) * _maxSpeed;
        y = -1 * Math.sin(a) * _maxSpeed;
        p2Body.velocity.x = x;
        p2Body.velocity.y = y;
      }

      return p2Body;
    }
  }, {
    key: "postStepCustom",
    value: function postStepCustom() {
      var balls = this.world.queryObjects({
        instanceType: _Ball["default"]
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = balls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var ball = _step.value;
          ball.velocity.x = 0;
          ball.velocity.y = 0;
          ball.refreshFromPhysics();
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
    }
  }, {
    key: "preStepCustom",
    value: function preStepCustom(stepNumber, isReenact) {
      for (var _i = 0, _Object$keys = Object.keys(players_keys); _i < _Object$keys.length; _i++) {
        var playerId = _Object$keys[_i];
        // handle keyboard presses
        var playerShip = this.world.queryObject({
          playerId: parseInt(playerId),
          instanceType: _Ship["default"]
        });

        if (playerShip) {
          var Keys = players_keys[playerId];
          var power = 1;

          if (playerShip.place === 'top' || playerShip.place === 'bot') {
            if (Keys.right) {
              var impulse = [power, 0];
              playerShip.physicsObj.applyImpulse(impulse);
            }

            if (Keys.left) {
              var _impulse = [power * -1, 0];
              playerShip.physicsObj.applyImpulse(_impulse);
            }
          }

          if (playerShip.place === 'left' || playerShip.place === 'right') {
            if (Keys.up) {
              var _impulse2 = [0, power];
              playerShip.physicsObj.applyImpulse(_impulse2);
            }

            if (Keys.down) {
              var _impulse3 = [0, power * -1];
              playerShip.physicsObj.applyImpulse(_impulse3);
            }
          } //this.emit('shoot', playerShip);


          playerShip.refreshFromPhysics();
        }
      }
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(AsteroidsGameEngine.prototype), "processInput", this).call(this, inputData, playerId);

      if (inputData.input === 'updateKeys') {
        var Keys = inputData.options.Keys;
        players_keys[playerId] = Keys;
      }
    } // returns a random number between -0.5 and 0.5

  }, {
    key: "rand",
    value: function rand() {
      var randnum = Math.random() * 2;
      return Math.round(randnum);
    }
  }, {
    key: "getShipsNb",
    value: function getShipsNb() {
      var ships = this.world.queryObjects({
        instanceType: _Ship["default"]
      });
      var shipsnb = [0, 0, 0, 0];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ships[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var ship = _step2.value;

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
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return shipsnb;
    } // create ship

  }, {
    key: "addShip",
    value: function addShip(playerId) {
      var shipsnb = this.getShipsNb();
      var position = null;
      var place = null;

      if (shipsnb[0] === 0) {
        position = new _lanceGg.TwoVector(0, -this.gameWidth / 2);
        place = 'bot';
      } else if (shipsnb[1] === 0) {
        position = new _lanceGg.TwoVector(0, this.gameWidth / 2);
        place = 'top';
      } else if (shipsnb[2] === 0) {
        position = new _lanceGg.TwoVector(-this.gameWidth / 2, 0);
        place = 'left';
      } else if (shipsnb[3] === 0) {
        position = new _lanceGg.TwoVector(this.gameWidth / 2, 0);
        place = 'right';
      }

      var s = new _Ship["default"](this, {}, {
        playerId: playerId,
        position: position
      });
      this.ships[place].push(s);
      s.place = place;
      s.lives = this.lives;
      this.addObjectToWorld(s);
    } // create asteroids

  }, {
    key: "addball",
    value: function addball() {
      var randvx = this.rand();
      var vx;

      if (randvx === 0) {
        vx = -1 * this.maxAsteroidSpeed;
      } else if (randvx === 1) {
        vx = this.maxAsteroidSpeed;
      } else if (randvx === 2) {
        vx = 0;
      }

      var randvy = this.rand();
      var vy = this.maxAsteroidSpeed;

      if (randvy === 0) {
        vy = -1 * this.maxAsteroidSpeed;
      } else if (randvy === 1) {
        vy = this.maxAsteroidSpeed;
      } else if (randvy === 2 && !vx === 0) {
        vy = 0;
      }

      console.log(vx);
      console.log(vy); // Create asteroid Body

      var a = new _Ball["default"](this, {}, {});
      this.addObjectToWorld(a);
      a.physicsObj.applyImpulse([vx, vy]);
    }
  }]);

  return AsteroidsGameEngine;
}(_lanceGg.GameEngine);

exports["default"] = AsteroidsGameEngine;
//# sourceMappingURL=AsteroidsGameEngine.js.map