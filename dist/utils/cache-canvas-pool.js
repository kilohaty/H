import CacheCanvas from './cache-canvas';
export default (function () {
    var pool = [];
    return {
        get: function (fn, width, height) {
            var cc = pool.find(function (cc) { return cc.isFree(); });
            if (!cc) {
                cc = new CacheCanvas();
                pool.push(cc);
            }
            cc.setBusy();
            cc.setWidth(width || 1);
            cc.setHeight(height || 1);
            cc.ctx.save();
            fn(cc, function () {
                cc.ctx.restore();
                cc.setFree();
            });
        }
    };
}());
//# sourceMappingURL=cache-canvas-pool.js.map