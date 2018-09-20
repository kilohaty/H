import * as tslib_1 from "tslib";
import DisplayObject from './display-object';
import TextHelper from '../utils/text-helper';
var DEFAULT_FONT_FAMILY = '"PingFang SC", Verdana, "Helvetica Neue", "Microsoft Yahei", "Hiragino Sans GB", "Microsoft Sans Serif", "WenQuanYi Micro Hei", sans-serif';
var Text = /** @class */ (function (_super) {
    tslib_1.__extends(Text, _super);
    function Text(options) {
        var _this = _super.call(this, null) || this;
        _this.type = 'text';
        _this.fontSize = 14;
        _this.fontWeight = 'normal';
        _this.fontFamily = DEFAULT_FONT_FAMILY;
        _this.color = '#000000';
        _this.set(options);
        return _this;
    }
    Text.prototype.update = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (['text', 'fontSize', 'fontWeight', 'fontFamily'].indexOf(key) !== -1) {
                    this.calcDimensions();
                }
                this.updateFlag = true;
                return [2 /*return*/];
            });
        });
    };
    Text.prototype.calcDimensions = function () {
        if (!this.text || !this.fontSize) {
            this.width = this.height = 0;
            return;
        }
        var cssText = "\n      font-family: " + this.fontFamily + ";\n      font-size: " + this.fontSize + "px;\n      font-weight: " + this.fontWeight + ";\n    ";
        var dimensions = TextHelper.measureText(this.text, cssText);
        this.width = dimensions.width;
        this.height = dimensions.height;
    };
    Text.prototype.render = function (ctx) {
        var _a = this.getOriginPoint(), ox = _a.x, oy = _a.y;
        var dstX = this.scaleX < 0 ? -this.width : 0;
        var dstY = this.scaleY < 0 ? -this.height : 0;
        ctx.save();
        ctx.translate(this.left - ox, this.top - oy);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.color;
        ctx.font = this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
        ctx.fillText(this.text, dstX, dstY);
        ctx.restore();
        this.updateFlag = false;
    };
    Text.updateList = tslib_1.__spread(DisplayObject.updateList, ['text', 'fontSize', 'fontWeight', 'fontFamily', 'color']);
    return Text;
}(DisplayObject));
export default Text;
//# sourceMappingURL=text.js.map