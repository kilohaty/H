import Layer from './layer';
import devtools from '../devtools';
import config from '../config';
import { throttle } from '../utils/misc';
var Stage = /** @class */ (function () {
    function Stage(options) {
        this.forceRender = false;
        this.hookInit = false;
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
        this.initDevtoolsBus();
        requestAnimationFrame(this.loopAnim.bind(this));
    }
    Stage.prototype.resize = function (width, height) {
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.width = width;
        this.height = height;
        this.layers.forEach(function (layer) { return layer.resize(width, height); });
        this.forceRender = true;
    };
    Stage.prototype.initDevtoolsBus = function () {
        var _this = this;
        devtools.bus.on('update.stage', function () {
            if (devtools.isEnable()) {
                devtools.bus.emit(devtools.EVENT_TP.UPDATE_STAGE, JSON.stringify(_this));
            }
        });
    };
    Stage.prototype.loopAnim = function () {
        this.renderObjects();
        this.initHook();
        requestAnimationFrame(this.loopAnim.bind(this));
    };
    Stage.prototype.initHook = function () {
        if (!config.devtools.enable) {
            return;
        }
        if (this.hookInit) {
            return;
        }
        if (devtools.isEnable()) {
            devtools.setStage(this);
            devtools.bus.emit(devtools.EVENT_TP.UPDATE_STAGE, JSON.stringify(this));
            this.hookInit = true;
        }
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
            _this.container.addEventListener(name, handler);
        });
    };
    return Stage;
}());
export default Stage;
//# sourceMappingURL=stage.js.map