var cacheCanvasId = 1;
var Status;
(function (Status) {
    Status[Status["Free"] = 0] = "Free";
    Status[Status["Busy"] = 1] = "Busy";
})(Status || (Status = {}));
var CacheCanvas = /** @class */ (function () {
    function CacheCanvas() {
        this.id = 1;
        this.width = 1;
        this.height = 1;
        this.status = Status.Free;
        this.id = cacheCanvasId++;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    CacheCanvas.prototype.isFree = function () {
        return this.status === Status.Free;
    };
    CacheCanvas.prototype.setWidth = function (width) {
        this.canvas.width = width;
    };
    CacheCanvas.prototype.setHeight = function (height) {
        this.canvas.height = height;
    };
    CacheCanvas.prototype.setFree = function () {
        this.status = Status.Free;
    };
    CacheCanvas.prototype.setBusy = function () {
        this.status = Status.Busy;
    };
    return CacheCanvas;
}());
export default CacheCanvas;
//# sourceMappingURL=cache-canvas.js.map