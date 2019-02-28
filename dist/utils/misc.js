import * as tslib_1 from "tslib";
import CCPool from './cache-canvas-pool';
var PI = Math.PI, cos = Math.cos, sin = Math.sin;
function throttle(delay, fn, trailing) {
    var last = 0;
    var timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        var context = this;
        var args = arguments;
        var current = Date.now();
        if (current - last > delay) {
            fn.call.apply(fn, tslib_1.__spread([context], args));
            last = current;
        }
        else if (trailing) {
            timer = setTimeout(function () {
                fn.call.apply(fn, tslib_1.__spread([context], args));
                last = Date.now();
            }, delay - (current - last));
        }
    };
}
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
function isPointInPath(_a, renderFunction, points) {
    var x = _a.x, y = _a.y;
    var res = false;
    CCPool.get(function (_a) {
        var ctx = _a.ctx;
        if (renderFunction) {
            renderFunction(ctx);
        }
        else {
            (points || []).forEach(function (p, i) { return ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y); });
        }
        res = ctx.isPointInPath(x, y);
    });
    return res;
}
function isPointInRect(rect, _a) {
    var x = _a.x, y = _a.y;
    if (rect.angle) {
        var renderFunction = function (ctx) {
            ctx.translate(rect.rotateOriginLeft, rect.rotateOriginTop);
            ctx.rotate(degreesToRadians(rect.angle));
            ctx.translate(rect.left - rect.rotateOriginLeft, rect.top - rect.rotateOriginTop);
            ctx.rect(0, 0, rect.width, rect.height);
            ctx.stroke();
        };
        return isPointInPath({ x: x, y: y }, renderFunction);
    }
    var left = rect.left;
    var right = rect.left + rect.width;
    var top = rect.top;
    var bottom = rect.top + rect.height;
    return x >= left && x <= right && y >= top && y <= bottom;
}
export { throttle, loadImage, degreesToRadians, radiansToDegrees, rotatePoint, isPointInPath, isPointInRect, };
//# sourceMappingURL=misc.js.map