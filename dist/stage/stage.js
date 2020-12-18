import Layer from './layer';
import { throttle } from '../utils/misc';
var Stage = /** @class */ (function () {
    function Stage(options) {
        this.forceRender = false;
        this.hookInit = false;
        this.animationFrameId = null;
        this.eventHandlers = {};
        this.layers = [];
        var el = options.el;
        var width = +options.width || 300;
        var height = +options.height || 150;
        this.container = typeof el === 'string' ? document.querySelector(el) : el;
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.position = 'relative';
        this.width = width;
        this.height = height;
        this.throttleDelay = options.throttleDelay || 0;
        for (var i = 0; i < (options.layerNumber || 1); i++) {
            var layer = new Layer({
                container: this.container,
                width: this.width,
                height: this.height,
                layerIndex: i
            });
            this.layers.push(layer);
        }
        this.initEvents();
        this.animationFrameId = requestAnimationFrame(this.loopAnim.bind(this));
    }
    Stage.prototype.resize = function (width, height) {
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.width = width;
        this.height = height;
        this.layers.forEach(function (layer) { return layer.resize(width, height); });
        this.forceRender = true;
    };
    Stage.prototype.loopAnim = function () {
        this.renderObjects();
        this.animationFrameId = requestAnimationFrame(this.loopAnim.bind(this));
    };
    Stage.prototype.renderObjects = function () {
        var _this = this;
        this.layers.forEach(function (layer) {
            layer.renderObjects(_this.forceRender || layer.forceRender);
            layer.forceRender = false;
        });
        this.forceRender = false;
    };
    Stage.prototype.initEvents = function () {
        var _this = this;
        var eventMap = [
            {
                name: 'mouseenter',
                layerFuncName: 'onMouseEnter'
            },
            {
                name: 'mousemove',
                layerFuncName: 'onMouseMove',
                throttle: true
            },
            {
                name: 'mousedown',
                layerFuncName: 'onMouseDown'
            },
            {
                name: 'click',
                layerFuncName: 'onClick'
            },
            {
                name: 'mouseup',
                layerFuncName: 'onMouseUp'
            },
            {
                name: 'mouseleave',
                layerFuncName: 'onMouseLeave'
            },
            {
                name: 'contextmenu',
                layerFuncName: 'onContextMenu'
            },
        ];
        eventMap.forEach(function (_a) {
            var name = _a.name, layerFuncName = _a.layerFuncName, doThrottle = _a.throttle;
            var fn = function (e) {
                for (var i = _this.layers.length - 1; i >= 0; i--) {
                    var layer = _this.layers[i];
                    layer[layerFuncName].call(layer, e);
                }
            };
            var handler = doThrottle && _this.throttleDelay ? throttle(_this.throttleDelay, fn, false) : fn;
            _this.eventHandlers[name] = handler;
            _this.container.addEventListener(name, handler);
        });
    };
    Stage.prototype.removeEvents = function () {
        for (var type in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(type)) {
                this.container.removeEventListener(type, this.eventHandlers[type]);
            }
        }
    };
    Stage.prototype.stopAnim = function () {
        cancelAnimationFrame(this.animationFrameId);
    };
    Stage.prototype.destroy = function () {
        this.stopAnim();
        this.removeEvents();
    };
    return Stage;
}());
export default Stage;
//# sourceMappingURL=stage.js.map