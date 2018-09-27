import * as tslib_1 from "tslib";
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
    return Stage;
}());
export default Stage;
//# sourceMappingURL=stage.js.map