/*!
 * React-swipe-to-delete-component v0.1.1
 * Implement the 'swipe to delete' UI-pattern in the React library.
 * https://github.com/gaer87/react-swipe-to-delete-component

 * Copyright 2017, Fedotov Alexander
 * Released under the MIT license.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "react"], factory);
	else if(typeof exports === 'object')
		exports["SwipeToDeleteComponent"] = factory(require("jquery"), require("react"));
	else
		root["SwipeToDeleteComponent"] = factory(root["$"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jquery = __webpack_require__(2);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _background = __webpack_require__(4);

	var _background2 = _interopRequireDefault(_background);

	var _model = __webpack_require__(5);

	var _model2 = _interopRequireDefault(_model);

	var _isMobile = __webpack_require__(6);

	var _isMobile2 = _interopRequireDefault(_isMobile);

	var _device = __webpack_require__(7);

	var _device2 = _interopRequireDefault(_device);

	__webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SwipeToDelete = function (_React$Component) {
	  _inherits(SwipeToDelete, _React$Component);

	  function SwipeToDelete(props) {
	    _classCallCheck(this, SwipeToDelete);

	    var _this = _possibleConstructorReturn(this, (SwipeToDelete.__proto__ || Object.getPrototypeOf(SwipeToDelete)).call(this, props));

	    _this.state = { isDeleted: false };

	    _this.model = new _model2.default({ deleteSwipe: _this.props.deleteSwipe });
	    _this.device = _device2.default.factory(_isMobile2.default.any());

	    _this.bindHandlers();
	    return _this;
	  }

	  _createClass(SwipeToDelete, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      if (this.state.isDeleted) {
	        return null;
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'swipe-to-delete' },
	        _react2.default.createElement(
	          'div',
	          { className: 'js-delete' },
	          this.props.background
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'js-content', ref: function ref(el) {
	              return _this2.regionContent = el;
	            } },
	          this.props.children
	        )
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.addHandlers();
	    }
	  }, {
	    key: 'bindHandlers',
	    value: function bindHandlers() {
	      this.addHandlers = this.addHandlers.bind(this);
	      this.interact = this.interact.bind(this);
	      this.moveAt = this.moveAt.bind(this);
	      this.stopInteract = this.stopInteract.bind(this);
	      this.offInteract = this.offInteract.bind(this);
	      this.endInteract = this.endInteract.bind(this);
	      this.onDelete = this.onDelete.bind(this);
	      this.onCancel = this.onCancel.bind(this);
	    }
	  }, {
	    key: 'addHandlers',
	    value: function addHandlers() {
	      this.startInteract().done(this.interact).then(this.stopInteract).always(this.offInteract).then(this.endInteract).fail(this.addHandlers);
	    }
	  }, {
	    key: 'startInteract',
	    value: function startInteract() {
	      var _this3 = this;

	      var dfd = new _jquery2.default.Deferred();
	      var el = (0, _jquery2.default)(this.regionContent.firstChild);

	      this.onInteract = function (e) {
	        _this3.model.startX = _this3.device.getPageX(e);
	        dfd.resolve();
	      };

	      el.one(this.device.getStartEventName(), this.onInteract);

	      return dfd;
	    }
	  }, {
	    key: 'interact',
	    value: function interact() {
	      (0, _jquery2.default)(document).on(this.device.getInteractEventName(), this.moveAt);
	    }
	  }, {
	    key: 'moveAt',
	    value: function moveAt(e) {
	      var target = (0, _jquery2.default)(this.regionContent.firstChild);
	      var res = this.device.getPageX(e) - this.model.startX;

	      target.css({ left: res });
	    }
	  }, {
	    key: 'offInteract',
	    value: function offInteract() {
	      (0, _jquery2.default)(document).off(this.device.getInteractEventName(), this.moveAt);
	    }
	  }, {
	    key: 'stopInteract',
	    value: function stopInteract() {
	      var _this4 = this;

	      var dfd = new _jquery2.default.Deferred();
	      var el = (0, _jquery2.default)(this.regionContent.firstChild);

	      this.onStopInteract = function (e) {
	        _this4.device.getStopEventNames().forEach(function (event) {
	          return el.off(event, _this4.onStopInteract);
	        });

	        var shift = (0, _jquery2.default)(e.currentTarget).position().left;
	        !shift ? dfd.reject(e) : dfd.resolve(e);
	      };

	      this.device.getStopEventNames().forEach(function (event) {
	        return el.one(event, _this4.onStopInteract);
	      });

	      return dfd;
	    }
	  }, {
	    key: 'endInteract',
	    value: function endInteract(event) {
	      var dfd = new _jquery2.default.Deferred();
	      var target = (0, _jquery2.default)(event.currentTarget);
	      var swipePercent = this.getSwipePercent();

	      dfd.done(this.onDelete).fail(this.onCancel);

	      if (this.model.isDelete(swipePercent)) {
	        target.one('transitionend', function (e) {
	          return dfd.resolve(e);
	        });
	        swipePercent < 0 ? target.addClass('js-transition-delete-left') : target.addClass('js-transition-delete-right');
	      } else {
	        target.one('transitionend', function (e) {
	          return dfd.reject(e);
	        });
	        target.addClass('js-transition-cancel');
	      }

	      return dfd;
	    }
	  }, {
	    key: 'getSwipePercent',
	    value: function getSwipePercent() {
	      var shift = (0, _jquery2.default)(this.regionContent.firstChild).position().left;
	      var width = (0, _jquery2.default)(this.regionContent).innerWidth();

	      return this.model.calcSwipePercent({ shift: shift, width: width });
	    }
	  }, {
	    key: 'onDelete',
	    value: function onDelete() {
	      this.props.onDelete();
	      this.setState({ isDeleted: true });
	    }
	  }, {
	    key: 'onCancel',
	    value: function onCancel(e) {
	      this.props.onCancel();

	      var target = (0, _jquery2.default)(e.currentTarget);
	      target.removeClass('js-transition-cancel');
	      target.css({ left: 0 });

	      this.model.startX = 0;
	    }
	  }]);

	  return SwipeToDelete;
	}(_react2.default.Component);

	exports.default = SwipeToDelete;


	SwipeToDelete.defaultProps = {
	  background: _react2.default.createElement(_background2.default, null),
	  onDelete: function onDelete() {},
	  onCancel: function onCancel() {}
	};

	SwipeToDelete.propTypes = {
	  children: _react2.default.PropTypes.element.isRequired,
	  background: _react2.default.PropTypes.element,
	  onDelete: _react2.default.PropTypes.func,
	  onCancel: _react2.default.PropTypes.func,
	  deleteSwipe: function deleteSwipe(props, propName, componentName) {
	    var val = props[propName];

	    if (!val) {
	      return;
	    }

	    if (typeof val !== 'number') {
	      return new Error('Invalid prop "deleteWidth" in ' + componentName + ': can be number only.');
	    }

	    if (val < 0 || val > 1) {
	      return new Error('Invalid prop "deleteWidth" in ' + componentName + ': can be in range [0, 1].');
	    }
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Background = function Background(props) {
	  var icon = _react2.default.createElement(
	    "svg",
	    { x: "0px", y: "0px", width: "512px", height: "512px", viewBox: "0 0 900.5 900.5" },
	    _react2.default.createElement(
	      "g",
	      null,
	      _react2.default.createElement("path", { d: "M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z    M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z", fill: "#FFFFFF" }),
	      _react2.default.createElement("path", { d: "M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874   c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576   c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z", fill: "#FFFFFF" })
	    ),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null),
	    _react2.default.createElement("g", null)
	  );

	  return _react2.default.createElement(
	    "div",
	    null,
	    icon,
	    icon
	  );
	};

	exports.default = Background;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Model = function () {
	  function Model(_ref) {
	    var _ref$deleteSwipe = _ref.deleteSwipe,
	        deleteSwipe = _ref$deleteSwipe === undefined ? .5 : _ref$deleteSwipe;

	    _classCallCheck(this, Model);

	    this.deleteSwipe = deleteSwipe;
	    this.startX = 0;
	  }

	  _createClass(Model, [{
	    key: "calcSwipePercent",
	    value: function calcSwipePercent(_ref2) {
	      var shift = _ref2.shift,
	          width = _ref2.width;

	      return shift / width;
	    }
	  }, {
	    key: "isDelete",
	    value: function isDelete(percent) {
	      return percent > 0 && percent >= this.deleteSwipe || percent < 0 && percent <= -this.deleteSwipe;
	    }
	  }]);

	  return Model;
	}();

	exports.default = Model;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isMobile = {
	  Android: function Android() {
	    return navigator.userAgent.match(/Android/i);
	  },
	  BlackBerry: function BlackBerry() {
	    return navigator.userAgent.match(/BlackBerry/i);
	  },
	  iOS: function iOS() {
	    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	  },
	  Opera: function Opera() {
	    return navigator.userAgent.match(/Opera Mini/i);
	  },
	  Windows: function Windows() {
	    return navigator.userAgent.match(/IEMobile/i);
	  },
	  any: function any() {
	    return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
	  }
	};

	exports.default = isMobile;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Device = function () {
	  function Device() {
	    _classCallCheck(this, Device);
	  }

	  _createClass(Device, null, [{
	    key: 'factory',
	    value: function factory(isTouch) {
	      return isTouch ? new Touch() : new Mouse();
	    }
	  }]);

	  return Device;
	}();

	exports.default = Device;

	var Touch = function (_Device) {
	  _inherits(Touch, _Device);

	  function Touch() {
	    _classCallCheck(this, Touch);

	    return _possibleConstructorReturn(this, (Touch.__proto__ || Object.getPrototypeOf(Touch)).apply(this, arguments));
	  }

	  _createClass(Touch, [{
	    key: 'getPageX',
	    value: function getPageX(e) {
	      return e.originalEvent.targetTouches[0].pageX;
	    }
	  }, {
	    key: 'getStartEventName',
	    value: function getStartEventName() {
	      return 'touchstart';
	    }
	  }, {
	    key: 'getInteractEventName',
	    value: function getInteractEventName() {
	      return 'touchmove';
	    }
	  }, {
	    key: 'getStopEventNames',
	    value: function getStopEventNames() {
	      return ['touchend'];
	    }
	  }]);

	  return Touch;
	}(Device);

	var Mouse = function (_Device2) {
	  _inherits(Mouse, _Device2);

	  function Mouse() {
	    _classCallCheck(this, Mouse);

	    return _possibleConstructorReturn(this, (Mouse.__proto__ || Object.getPrototypeOf(Mouse)).apply(this, arguments));
	  }

	  _createClass(Mouse, [{
	    key: 'getPageX',
	    value: function getPageX(e) {
	      return e.pageX;
	    }
	  }, {
	    key: 'getStartEventName',
	    value: function getStartEventName() {
	      return 'mousedown';
	    }
	  }, {
	    key: 'getInteractEventName',
	    value: function getInteractEventName() {
	      return 'mousemove';
	    }
	  }, {
	    key: 'getStopEventNames',
	    value: function getStopEventNames() {
	      return ['mouseup', 'mouseleave'];
	    }
	  }]);

	  return Mouse;
	}(Device);

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;