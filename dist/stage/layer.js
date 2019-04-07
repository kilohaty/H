import * as tslib_1 from "tslib";
import Bus from '../utils/bus';
import EventTypes from './event-types';
import devtools from '../devtools';
function createCanvas(width, height, zIndex) {
    if (width === void 0) { width = 300; }
    if (height === void 0) { height = 150; }
    if (zIndex === void 0) { zIndex = 0; }
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', String(width));
    canvas.setAttribute('height', String(height));
    canvas.style.cssText = "position: absolute; z-index: " + zIndex + "; top: 0; left: 0;";
    return canvas;
}
var Layer = /** @class */ (function () {
    function Layer(options) {
        this.lastMouseEnterObjectId = null;
        this.objects = [];
        this.forceRender = false;
        this.container = options.container;
        this.width = options.width;
        this.height = options.height;
        this.layerIndex = options.layerIndex;
        this.bus = new Bus();
        // canvas
        var canvas = createCanvas(this.width, this.height, this.layerIndex);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.container.appendChild(canvas);
        // cache canvas
        var cacheCanvas = createCanvas(this.width, this.height);
        this.cacheCanvas = cacheCanvas;
        this.cacheCtx = cacheCanvas.getContext('2d');
    }
    Layer.prototype.resize = function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.cacheCanvas.width = width;
        this.cacheCanvas.height = height;
        this.width = width;
        this.height = height;
        return this;
    };
    Layer.prototype.add = function () {
        var _this = this;
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        var _a;
        objects.forEach(function (object) { return object.layerIndex = _this.layerIndex; });
        (_a = this.objects).push.apply(_a, tslib_1.__spread(objects));
        devtools.bus.emit('update.stage', null);
        return this;
    };
    Layer.prototype.insert = function (insertIndex) {
        var _this = this;
        var objects = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objects[_i - 1] = arguments[_i];
        }
        var _a;
        objects.forEach(function (object) { return object.layerIndex = _this.layerIndex; });
        (_a = this.objects).splice.apply(_a, tslib_1.__spread([insertIndex, 0], objects));
        devtools.bus.emit('update.stage', null);
        return this;
    };
    Layer.prototype.removeById = function (objectId) {
        var removed = false;
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === objectId) {
                this.objects.splice(i, 1);
                removed = true;
                break;
            }
        }
        this.forceRender = true;
        devtools.bus.emit('update.stage', null);
        return removed;
    };
    Layer.prototype.clear = function () {
        this.objects = [];
        this.forceRender = true;
        devtools.bus.emit('update.stage', null);
    };
    Layer.prototype.shouldRender = function () {
        // 优化：visible 为 false 时，可不做更新
        return this.objects.some(function (object) {
            return object.needUpdate();
        });
    };
    Layer.prototype.renderObjects = function (forceRender) {
        var _this = this;
        if (forceRender || this.shouldRender()) {
            this.cacheCtx.clearRect(0, 0, this.width, this.height);
            this.objects.forEach(function (el) { return el.render(_this.cacheCtx); });
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.cacheCanvas, 0, 0);
        }
    };
    Layer.prototype.on = function (type, fn, onlyOnce) {
        if (onlyOnce === void 0) { onlyOnce = false; }
        this.bus.on(type, fn, onlyOnce);
        return this;
    };
    Layer.prototype.onMouseEnter = function (e) {
        this.bus.emit(EventTypes.stage.mouseEnter, { e: e });
    };
    Layer.prototype.onMouseMove = function (e) {
        this.bus.emit(EventTypes.stage.mouseMove, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            if (!this.lastMouseEnterObjectId) {
                this.bus.emit(EventTypes.object.mouseEnter, { e: e, object: obj });
            }
            else {
                if (this.lastMouseEnterObjectId !== obj.id) {
                    var lastObj = this.getObjectById(this.lastMouseEnterObjectId);
                    this.bus.emit(EventTypes.object.mouseLeave, { e: e, object: lastObj });
                    this.bus.emit(EventTypes.object.mouseEnter, { e: e, object: obj });
                }
                else {
                    this.bus.emit(EventTypes.object.mouseMove, { e: e, object: obj });
                }
            }
            this.lastMouseEnterObjectId = obj.id;
        }
        else {
            if (this.lastMouseEnterObjectId) {
                var lastObj = this.getObjectById(this.lastMouseEnterObjectId);
                this.bus.emit(EventTypes.object.mouseLeave, { e: e, object: lastObj });
            }
            this.lastMouseEnterObjectId = null;
        }
    };
    Layer.prototype.onMouseDown = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.mouseDown, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.mouseDown, { e: e, object: obj });
        }
    };
    Layer.prototype.onClick = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.click, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.click, { e: e, object: obj });
        }
    };
    Layer.prototype.onMouseUp = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.mouseUp, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.mouseUp, { e: e, object: obj });
        }
    };
    Layer.prototype.onMouseLeave = function (e) {
        this.bus.emit(EventTypes.stage.mouseLeave, { e: e });
    };
    Layer.prototype.onContextMenu = function (e) {
        this.bus.emit(EventTypes.stage.contextMenu, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.contextMenu, { e: e, object: obj });
        }
    };
    Layer.prototype.getObjectById = function (id) {
        return this.objects.find(function (obj) { return obj.id === id; });
    };
    Layer.prototype.getObjectByPoint = function (point) {
        var obj = null;
        for (var i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].isPointOnObject(point)) {
                obj = this.objects[i];
                break;
            }
        }
        return obj;
    };
    return Layer;
}());
export default Layer;
//# sourceMappingURL=layer.js.map