import * as tslib_1 from "tslib";
import DisplayObject from './display-object';
import { loadImage } from '../utils/misc';
var Sprite = /** @class */ (function (_super) {
    tslib_1.__extends(Sprite, _super);
    function Sprite(options) {
        var _this = _super.call(this, null) || this;
        _this.type = 'sprite';
        _this.lastFrameTime = 0;
        _this.frameIndex = 0;
        _this.iteratedCount = 0;
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
                        this.width = frame.frameWidth;
                        this.height = frame.frameHeight;
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
                                this.width = frame.frameWidth;
                                this.height = frame.frameHeight;
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
    Sprite.prototype.reset = function () {
        this.lastFrameTime = 0;
        this.frameIndex = 0;
        this.iteratedCount = 0;
    };
    Sprite.prototype.isAnimationEnd = function () {
        var frame = this.frames[this.status];
        return frame.iterationCount && this.iteratedCount > frame.iterationCount;
    };
    Sprite.prototype._render = function (ctx) {
        if (!this.bitmapSource) {
            this.updateFlag = false;
            return;
        }
        var now = Date.now();
        var frame = this.frames[this.status];
        var frameData = frame[this.frameIndex];
        var _a = this.getOriginPoint(), ox = _a.x, oy = _a.y;
        var dstX = this.scaleX < 0 ? -this.width : 0;
        var dstY = this.scaleY < 0 ? -this.height : 0;
        ctx.save();
        ctx.translate(this.left - ox, this.top - oy);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.drawImage(this.bitmapSource, frameData.x, frameData.y, this.width, this.height, dstX, dstY, this.width, this.height);
        ctx.restore();
        if (!this.lastFrameTime) {
            this.lastFrameTime = now;
        }
        else if (now - this.lastFrameTime >= frame.frameDuration) {
            this.frameIndex++;
            this.lastFrameTime = now;
            if (this.frameIndex >= frame.length) {
                this.frameIndex = 0;
                this.iteratedCount++;
            }
        }
        this.updateFlag = !this.isAnimationEnd();
    };
    Sprite.prototype.replay = function () {
        this.reset();
        this.updateFlag = true;
    };
    Sprite.updateList = tslib_1.__spread(DisplayObject.updateList, ['src', 'frames', 'status']);
    return Sprite;
}(DisplayObject));
export default Sprite;
//# sourceMappingURL=sprite.js.map