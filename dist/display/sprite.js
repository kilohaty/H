import * as tslib_1 from "tslib";
import DisplayObject from './display-object';
import { loadImage, isPointInRect, degreesToRadians } from '../utils/misc';
var Sprite = /** @class */ (function (_super) {
    tslib_1.__extends(Sprite, _super);
    function Sprite(options) {
        var _this = _super.call(this, null) || this;
        _this.type = 'sprite';
        _this.paused = false;
        _this.lastFrameTime = 0;
        _this.frameIndex = 0;
        _this.iteratedCount = 0;
        _this.statusEndCallbacks = {};
        _this.playbackRate = 1;
        _this.set(options);
        return _this;
    }
    Sprite.prototype.update = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, frame, err_1, frame;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(key === 'src')) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, loadImage(this.src)];
                    case 2:
                        _a.bitmapSource = _b.sent();
                        frame = this.frames[this.status];
                        this.width = frame[0].w;
                        this.height = frame[0].h;
                        this.reset();
                        this.updateFlag = true;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                    case 5:
                        if (key === 'status') {
                            frame = this.frames[this.status];
                            if (!frame.src || frame.src === this.src) {
                                this.width = frame[0].w;
                                this.height = frame[0].h;
                                this.reset();
                            }
                            else {
                                this.src = frame.src;
                            }
                        }
                        this.updateFlag = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Sprite.prototype.setStatus = function (status, animationEndCallback, onlyOnce) {
        if (onlyOnce === void 0) { onlyOnce = true; }
        if (animationEndCallback) {
            this.addStatusEndCallback(status, animationEndCallback, onlyOnce);
        }
        this.status = status;
        return this;
    };
    Sprite.prototype.addStatusEndCallback = function (status, callbackFn, onlyOnce) {
        if (!this.statusEndCallbacks[status]) {
            this.statusEndCallbacks[status] = [];
        }
        this.statusEndCallbacks[status].push({
            fn: callbackFn,
            onlyOnce: onlyOnce
        });
    };
    Sprite.prototype.onStatusEnd = function (status) {
        var callbacks = this.statusEndCallbacks[status];
        if (!callbacks || !callbacks.length) {
            return;
        }
        for (var i = 0; i < callbacks.length; i++) {
            var _a = callbacks[i], fn = _a.fn, onlyOnce = _a.onlyOnce;
            if (onlyOnce) {
                callbacks.splice(i--, 1);
            }
            fn && fn();
        }
    };
    Sprite.prototype.reset = function () {
        this.lastFrameTime = 0;
        this.frameIndex = 0;
        this.iteratedCount = 0;
        this.paused = false;
    };
    Sprite.prototype.isAnimationEnd = function () {
        var frame = this.frames[this.status];
        return this.paused || frame.i && this.iteratedCount >= frame.i;
    };
    Sprite.prototype._render = function (ctx) {
        if (!this.bitmapSource) {
            this.updateFlag = false;
            return;
        }
        var now = Date.now();
        var frame = this.frames[this.status];
        if (this.isAnimationEnd()) {
            this.frameIndex = frame.l - 1;
        }
        var frameData = frame[this.frameIndex];
        this.width = frameData.w;
        this.height = frameData.h;
        var dstX = this.scaleX < 0 ? -this.width : 0;
        var dstY = this.scaleY < 0 ? -this.height : 0;
        ctx.save();
        if (this.opacity !== 1) {
            ctx.globalAlpha = this.opacity || 1;
        }
        if (this.angle) {
            var cx = this.scaleX * (frameData.cx - frameData.w / 2);
            var cy = this.scaleY * (frameData.cy - frameData.h / 2);
            ctx.translate(this.left, this.top);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.translate(this.getOriginLeft() - this.left - cx, this.getOriginTop() - this.top - cy);
        }
        else {
            var cx = this.scaleX * (frameData.cx - frameData.w / 2);
            var cy = this.scaleY * (frameData.cy - frameData.h / 2);
            ctx.translate(this.getOriginLeft() - cx, this.getOriginTop() - cy);
        }
        ctx.scale(this.scaleX, this.scaleY);
        ctx.drawImage(this.bitmapSource, frameData.x, frameData.y, this.width, this.height, dstX, dstY, this.width, this.height);
        this.renderDebug(ctx, dstX, dstY, this.width, this.height);
        this.renderDevtoolsDebug(ctx, dstX, dstY, this.width, this.height);
        ctx.restore();
        if (!this.lastFrameTime) {
            this.lastFrameTime = now;
            this.frameIndex++;
        }
        else if (now - this.lastFrameTime >= frame.d / this.playbackRate) {
            this.lastFrameTime = now;
            this.frameIndex++;
        }
        if (this.frameIndex >= frame.l) {
            this.frameIndex = 0;
            this.iteratedCount++;
        }
        this.updateFlag = !this.isAnimationEnd();
        if (!this.updateFlag) {
            this.onStatusEnd(this.status);
        }
    };
    Sprite.prototype.pause = function () {
        this.paused = true;
    };
    Sprite.prototype.resume = function () {
        this.paused = false;
        this.updateFlag = true;
    };
    Sprite.prototype.replay = function () {
        this.reset();
        this.updateFlag = true;
    };
    Sprite.prototype._isPointOnObject = function (point) {
        var frame = this.frames[this.status];
        var frameData = frame[this.frameIndex];
        var fixCx = (this.width / 2 - frameData.cx) * this.scaleX;
        var fixCy = (this.height / 2 - frameData.cy) * this.scaleY;
        return isPointInRect({
            rotateOriginLeft: this.left,
            rotateOriginTop: this.top,
            left: this.getOriginLeft() + fixCx,
            top: this.getOriginTop() + fixCy,
            width: this.getWidth(),
            height: this.getHeight(),
            angle: this.angle
        }, point);
    };
    Sprite.updateList = tslib_1.__spread(DisplayObject.updateList, ['src', 'frames', 'status']);
    return Sprite;
}(DisplayObject));
export default Sprite;
//# sourceMappingURL=sprite.js.map