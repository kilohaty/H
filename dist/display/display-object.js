import UID from '../utils/uid';
import devtools from '../devtools';
import config from '../config';
var abs = Math.abs;
var DisplayObject = /** @class */ (function () {
    function DisplayObject(options) {
        var _this = this;
        this.type = 'displayObject';
        this.updateFlag = false;
        this.layerIndex = 0;
        this.visible = true;
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.originX = 'left';
        this.originY = 'top';
        this.scaleX = 1;
        this.scaleY = 1;
        this.angle = 0;
        this.debug = false;
        this.id = UID.gen();
        this.proxy = new Proxy(this, {
            get: function (target, key, receiver) {
                if (key === 'toJSON') {
                    return function () {
                        return Object.assign({}, target, { proxy: undefined });
                    };
                }
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                if (target[key] !== value) {
                    Reflect.set(target, key, value, receiver);
                    if (receiver.constructor.updateList.indexOf(key) !== -1) {
                        _this.update(key);
                    }
                }
                // devtools
                if (key !== 'updateFlag') {
                    if (devtools.isEnable()) {
                        devtools.bus.emit(devtools.EVENT_TP.UPDATE_OBJECT, {
                            layerIndex: _this.layerIndex,
                            object: JSON.stringify(_this)
                        });
                    }
                }
                return true;
            }
        });
        this.set(options);
        return this.proxy;
    }
    DisplayObject.prototype.update = function (key) {
        this.updateFlag = true;
    };
    DisplayObject.prototype.set = function (options) {
        if (typeof options === 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this[key] = options[key];
                }
            }
        }
    };
    DisplayObject.prototype.needUpdate = function () {
        return this.updateFlag;
    };
    DisplayObject.prototype.render = function (ctx) {
        if (this.visible) {
            this._render(ctx);
        }
    };
    DisplayObject.prototype.isPointOnObject = function (point) {
        return this.visible
            ? this._isPointOnObject(point)
            : false;
    };
    ;
    DisplayObject.prototype.renderDebug = function (ctx, x, y, width, height) {
        if (this.debug) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, width, height);
        }
    };
    DisplayObject.prototype.renderDevtoolsDebug = function (ctx, x, y, width, height) {
        if (devtools.isEnable()) {
            if (this.id === devtools.getSelectedObjectId()) {
                ctx.fillStyle = config.devtools.highlightColor;
                ctx.fillRect(x, y, width, height);
            }
        }
    };
    DisplayObject.prototype.getOriginLeft = function () {
        return this.originX === 'center' ? this.left - this.getWidth() / 2
            : this.originX === 'right' ? this.left - this.getWidth() : this.left;
    };
    ;
    DisplayObject.prototype.getOriginTop = function () {
        return this.originY === 'center' ? this.top - this.getHeight() / 2
            : this.originY === 'bottom' ? this.top - this.getHeight() : this.top;
    };
    ;
    DisplayObject.prototype.getWidth = function () {
        return abs(this.width * this.scaleX);
    };
    ;
    DisplayObject.prototype.getHeight = function () {
        return abs(this.height * this.scaleY);
    };
    ;
    DisplayObject.updateList = ['visible', 'left', 'top', 'originX', 'originY', 'scaleX', 'scaleY', 'angle', 'debug'];
    return DisplayObject;
}());
export default DisplayObject;
//# sourceMappingURL=display-object.js.map