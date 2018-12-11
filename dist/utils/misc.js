import CCPool from './cache-canvas-pool';
var PI = Math.PI, cos = Math.cos, sin = Math.sin;
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = resolve.bind(null, image);
        image.onerror = reject.bind(null);
        image.src = src;
    });
}
function degreesToRadians(degrees) {
    return degrees * PI / 180;
}
function radiansToDegrees(radians) {
    return radians * 180 / PI;
}
function rotatePoint(origin, degrees, point) {
    var x1 = point.x;
    var y1 = point.y;
    var x2 = origin.x;
    var y2 = origin.y;
    var radians = degreesToRadians(degrees);
    var x = (x1 - x2) * cos(radians) - (y1 - y2) * sin(radians) + x2;
    var y = (x1 - x2) * sin(radians) + (y1 - y2) * cos(radians) + y2;
    return { x: x, y: y };
}
function isPointInPath(points, _a, renderFunction) {
    var x = _a.x, y = _a.y;
    var res = false;
    CCPool.get(function (_a) {
        var ctx = _a.ctx;
        if (renderFunction) {
            renderFunction(ctx);
        }
        else {
            points.forEach(function (p, i) { return ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y); });
        }
        res = ctx.isPointInPath(x, y);
    });
    return res;
}
function isPointInRect(rect, _a) {
    var _this = this;
    var x = _a.x, y = _a.y;
    var left = rect.left;
    var right = rect.left + rect.width;
    var top = rect.top;
    var bottom = rect.top + rect.height;
    if (rect.angle) {
        var points = [
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left, y: bottom },
        ].map(function (point) { return _this.rotatePoint({ x: left, y: top }, rect.angle, point); });
        return this.isPointInPath(points, { x: x, y: y });
    }
    return x >= left && x <= right && y >= top && y <= bottom;
}
export { loadImage, degreesToRadians, radiansToDegrees, rotatePoint, isPointInPath, isPointInRect, };
//# sourceMappingURL=misc.js.map