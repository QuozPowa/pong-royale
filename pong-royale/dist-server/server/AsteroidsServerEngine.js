"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Wall = _interopRequireDefault(require("../common/Wall"));

var _Ball = _interopRequireDefault(require("../common/Ball"));

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

var deleteBall = null;

var AsteroidsServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(AsteroidsServerEngine, _ServerEngine);

  function AsteroidsServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, AsteroidsServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsServerEngine).call(this, io, gameEngine, inputOptions));
    gameEngine.physicsEngine.world.on('beginContact', _this.handleCollision.bind(_assertThisInitialized(_this)));

    _this.gameEngine.on('postStep', _this.postStepCustom.bind(_assertThisInitialized(_this))); //gameEngine.on('shoot', this.shoot.bind(this));


    return _this;
  }

  _createClass(AsteroidsServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "start", this).call(this);

      this.gameEngine.addWalls();
      this.gameEngine.addball();
      this.gameEngine.addball();
    } // handle a collision on server only

  }, {
    key: "handleCollision",
    value: function handleCollision(evt) {
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
      var ball = null;
      var A;
      var B;
      this.gameEngine.world.forEachObject(function (id, obj) {
        if (obj.physicsObj === evt.bodyA) A = obj;
        if (obj.physicsObj === evt.bodyB) B = obj;
      });

      if (A instanceof _Wall["default"] && B instanceof _Ball["default"]) {
        ball = B;
      } else if (B instanceof _Wall["default"] && A instanceof _Ball["default"]) {
        ball = A;
      }

      var shipsnb = this.gameEngine.getShipsNb();
      var walls_by_alias = this.gameEngine.walls_by_alias;

      if (ball && shipsnb[0] > 0 && (A == walls_by_alias.bot || B == walls_by_alias.bot)) {
        deleteBall = ball;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.gameEngine.ships['bot'][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ship = _step.value;
            ship.lives--;
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

      if (ball && shipsnb[1] > 0 && (A == walls_by_alias.top || B == walls_by_alias.top)) {
        deleteBall = ball;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.gameEngine.ships['top'][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ship = _step2.value;
            _ship.lives--;
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
      }

      if (ball && shipsnb[2] > 0 && (A == walls_by_alias.left || B == walls_by_alias.left.physicsObj)) {
        deleteBall = ball;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.gameEngine.ships['left'][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _ship2 = _step3.value;
            _ship2.lives--;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      if (ball && shipsnb[3] > 0 && (A == walls_by_alias.right || B == walls_by_alias.right)) {
        deleteBall = ball;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.gameEngine.ships['right'][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _ship3 = _step4.value;
            _ship3.lives--;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    } // shooting creates a bullet

  }, {
    key: "shoot",
    value: function shoot(player) {} //this.gameEngine.timer.add(this.gameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    // destroy the missile if it still exists

  }, {
    key: "destroyBullet",
    value: function destroyBullet(bulletId) {
      if (this.gameEngine.world.objects[bulletId]) {
        this.gameEngine.trace.trace(function () {
          return "bullet[".concat(bulletId, "] destroyed");
        });
        this.gameEngine.removeObjectFromWorld(bulletId);
      }
    }
  }, {
    key: "kill",
    value: function kill(ship) {
      if (ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }
  }, {
    key: "postStepCustom",
    value: function postStepCustom(stepNumber, isReenact) {
      if (deleteBall) {
        this.gameEngine.removeObjectFromWorld(deleteBall);
        this.gameEngine.addball();
        deleteBall = null;
      }
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      this.gameEngine.addShip(socket.playerId);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(AsteroidsServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.gameEngine.world.queryObjects({
          playerId: playerId
        })[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var o = _step5.value;
          this.gameEngine.removeObjectFromWorld(o.id);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }]);

  return AsteroidsServerEngine;
}(_lanceGg.ServerEngine);

exports["default"] = AsteroidsServerEngine;
//# sourceMappingURL=AsteroidsServerEngine.js.map