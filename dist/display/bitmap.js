import * as tslib_1 from "tslib";
import DisplayObject from './display-object';
import { loadImage } from '../utils/misc';
var Bitmap = /** @class */ (function (_super) {
    tslib_1.__extends(Bitmap, _super);
    function Bitmap(options) {
        var _this = _super.call(this, null) || this;
        _this.type = 'bitmap';
        _this.set(options);
        return _this;
    }
    Bitmap.prototype.update = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, err_1;
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
                        this.width = this.bitmapSource.width;
                        this.height = this.bitmapSource.height;
                        this.updateFlag = true;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                    case 5:
                        this.updateFlag = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Bitmap.prototype._render = function (ctx) {
        if (!this.bitmapSource) {
            this.updateFlag = false;
            return;
        }
        var _a = this.getOriginPoint(), ox = _a.x, oy = _a.y;
        var dstX = this.scaleX < 0 ? -this.width : 0;
        var dstY = this.scaleY < 0 ? -this.height : 0;
        ctx.save();
        ctx.translate(this.left - ox, this.top - oy);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.drawImage(this.bitmapSource, dstX, dstY);
        ctx.restore();
        this.updateFlag = false;
    };
    Bitmap.updateList = tslib_1.__spread(DisplayObject.updateList, ['src']);
    return Bitmap;
}(DisplayObject));
export default Bitmap;
//# sourceMappingURL=bitmap.js.map