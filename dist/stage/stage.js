import * as tslib_1 from "tslib";
import Bus from '../utils/bus';
import EventTypes from './event-types';
function createCanvas(width, height) {
    if (width === void 0) { width = 300; }
    if (height === void 0) { height = 150; }
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', String(width));
    canvas.setAttribute('height', String(height));
    canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
    return canvas;
}
var Stage = /** @class */ (function () {
    function Stage(options) {
        this.lastMouseEnterObjectId = null;
        this.forceRender = false;
        this.objects = [];
        var el = options.el;
        var width = +options.width || 300;
        var height = +options.height || 150;
        // canvas container
        this.container = typeof el === 'string' ? document.querySelector(el) : el;
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.position = 'relative';
        this.width = width;
        this.height = height;
        // canvas
        var canvas = createCanvas(width, height);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.container.appendChild(canvas);
        // cache canvas
        var cacheCanvas = createCanvas(width, height);
        this.cacheCanvas = cacheCanvas;
        this.cacheCtx = cacheCanvas.getContext('2d');
        requestAnimationFrame(this.loopAnim.bind(this));
        this.initBus();
    }
    Stage.prototype.loopAnim = function () {
        this.renderObjects();
        requestAnimationFrame(this.loopAnim.bind(this));
    };
    Stage.prototype.renderObjects = function () {
        var _this = this;
        if (!this.forceRender
            && this.objects.every(function (el) { return !el.visible || !el.needUpdate(); })) {
            return;
        }
        this.cacheCtx.clearRect(0, 0, this.width, this.height);
        this.objects.forEach(function (el) { return el.render(_this.cacheCtx); });
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.cacheCanvas, 0, 0);
        this.forceRender = false;
    };
    /**
     * add object to stage
     */
    Stage.prototype.add = function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        var _a;
        (_a = this.objects).push.apply(_a, tslib_1.__spread(objects));
        return this;
    };
    /**
     * remove object from stage by object id
     */
    Stage.prototype.remove = function (objectId) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === objectId) {
                this.objects.splice(i, 1);
                this.forceRender = true;
                break;
            }
        }
        return this;
    };
    Stage.prototype.initBus = function () {
        this.bus = new Bus();
        this.container.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('click', this.onClick.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.container.addEventListener('contextmenu', this.onContextMenu.bind(this));
    };
    Stage.prototype.onMouseEnter = function (e) {
        this.bus.emit(EventTypes.stage.mouseEnter, { e: e });
    };
    Stage.prototype.onMouseMove = function (e) {
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
    Stage.prototype.onMouseDown = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.mouseDown, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.mouseDown, { e: e, object: obj });
        }
    };
    Stage.prototype.onClick = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.click, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.click, { e: e, object: obj });
        }
    };
    Stage.prototype.onMouseUp = function (e) {
        if (e.button === 2)
            return;
        this.bus.emit(EventTypes.stage.mouseUp, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.mouseUp, { e: e, object: obj });
        }
    };
    Stage.prototype.onMouseLeave = function (e) {
        this.bus.emit(EventTypes.stage.mouseLeave, { e: e });
    };
    Stage.prototype.onContextMenu = function (e) {
        this.bus.emit(EventTypes.stage.contextMenu, { e: e });
        var obj = this.getObjectByPoint({ x: e.offsetX, y: e.offsetY });
        if (obj) {
            this.bus.emit(EventTypes.object.contextMenu, { e: e, object: obj });
        }
    };
    Stage.prototype.getObjectById = function (id) {
        return this.objects.find(function (obj) { return obj.id === id; });
    };
    Stage.prototype.getObjectByPoint = function (point) {
        var obj = null;
        for (var i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].isPointOnObject(point)) {
                obj = this.objects[i];
                break;
            }
        }
        return obj;
    };
    return Stage;
}());
export default Stage;
//# sourceMappingURL=stage.js.map