import * as tslib_1 from "tslib";
import DisplayObject from './display-object';
import { degreesToRadians, isPointInPath } from '../utils/misc';
var min = Math.min, max = Math.max;
var MIN_EDGE_NUMBER = 3;
var Polygon = /** @class */ (function (_super) {
    tslib_1.__extends(Polygon, _super);
    function Polygon(options) {
        var _this = _super.call(this, null) || this;
        _this.type = 'polygon';
        _this.points = [];
        _this.lineWidth = 1;
        _this.strokeColor = '#000000';
        _this.fillColor = 'transparent';
        _this.set(options);
        return _this;
    }
    Polygon.prototype.update = function (key) {
        if (key === 'points') {
            this.calcDimensions();
        }
        this.updateFlag = true;
    };
    Polygon.prototype.calcDimensions = function () {
        if (!this.points || this.points.length < MIN_EDGE_NUMBER) {
            return;
        }
        var minX = min.apply(void 0, tslib_1.__spread(this.points.map(function (p) { return p.x; })));
        var maxX = max.apply(void 0, tslib_1.__spread(this.points.map(function (p) { return p.x; })));
        var minY = min.apply(void 0, tslib_1.__spread(this.points.map(function (p) { return p.y; })));
        var maxY = max.apply(void 0, tslib_1.__spread(this.points.map(function (p) { return p.y; })));
        this.width = maxX - minX;
        this.height = maxY - minY;
    };
    Polygon.prototype._render = function (ctx) {
        if (!this.points || this.points.length < MIN_EDGE_NUMBER) {
            this.updateFlag = false;
            return;
        }
        ctx.save();
        this.__render(ctx, true, true);
        ctx.restore();
        this.updateFlag = false;
    };
    Polygon.prototype.__render = function (ctx, renderDebug, renderDevtoolsDebug) {
        if (renderDebug === void 0) { renderDebug = false; }
        if (renderDevtoolsDebug === void 0) { renderDevtoolsDebug = false; }
        var dstX = this.scaleX < 0 ? -this.width : 0;
        var dstY = this.scaleY < 0 ? -this.height : 0;
        if (this.angle) {
            ctx.translate(this.left, this.top);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.translate(this.getOriginLeft() - this.left, this.getOriginTop() - this.top);
        }
        else {
            ctx.translate(this.getOriginLeft(), this.getOriginTop());
        }
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        this.points.forEach(function (point, index) {
            ctx[index ? 'lineTo' : 'moveTo'](point.x + dstX, point.y + dstY);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        if (renderDebug) {
            this.renderDebug(ctx, dstX, dstY, this.width, this.height);
        }
        if (renderDevtoolsDebug) {
            this.renderDevtoolsDebug(ctx, dstX, dstY, this.width, this.height);
        }
    };
    Polygon.prototype._isPointOnObject = function (point) {
        return isPointInPath(point, this.__render.bind(this));
    };
    Polygon.updateList = tslib_1.__spread(DisplayObject.updateList, ['points', 'lineWidth', 'strokeColor', 'fillColor']);
    return Polygon;
}(DisplayObject));
export default Polygon;
//# sourceMappingURL=polygon.js.map