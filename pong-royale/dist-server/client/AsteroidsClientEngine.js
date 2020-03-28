"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _AsteroidsRenderer = _interopRequireDefault(require("../client/AsteroidsRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var betaTiltThreshold = 40;
var gammaTiltThreshold = 40;
var steerThreshold = 0.4;
var Keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

var AsteroidsClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(AsteroidsClientEngine, _ClientEngine);

  _createClass(AsteroidsClientEngine, [{
    key: "onKeyUp",
    value: function onKeyUp(e) {
      var kc = e.keyCode;
      if (kc === 37) Keys.left = false; // only one key per event
      else if (kc === 38) Keys.up = false; // so check exclusively
        else if (kc === 39) Keys.right = false;else if (kc === 40) Keys.down = false;
      this.sendInput("updateKeys", {
        Keys: Keys
      });
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      var kc = e.keyCode;
      if (kc === 37) Keys.left = true; // only one key per event
      else if (kc === 38) Keys.up = true; // so check exclusively
        else if (kc === 39) Keys.right = true;else if (kc === 40) Keys.down = true;
      this.sendInput("updateKeys", {
        Keys: Keys
      });
    }
  }]);

  function AsteroidsClientEngine(gameEngine, options) {
    var _this;

    _classCallCheck(this, AsteroidsClientEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsClientEngine).call(this, gameEngine, options, _AsteroidsRenderer["default"]));
    document.body.addEventListener('keyup', _this.onKeyUp.bind(_assertThisInitialized(_this)));
    document.body.addEventListener('keydown', _this.onKeyDown.bind(_assertThisInitialized(_this)));
    return _this;
  } // our pre-step is to process inputs that are "currently pressed" during the game step


  _createClass(AsteroidsClientEngine, [{
    key: "preStep",
    value: function preStep() {}
  }]);

  return AsteroidsClientEngine;
}(_lanceGg.ClientEngine);

exports["default"] = AsteroidsClientEngine;
//# sourceMappingURL=AsteroidsClientEngine.js.map