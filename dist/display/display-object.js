import UID from '../utils/uid';
var abs = Math.abs;
var DisplayObject = /** @class */ (function () {
    function DisplayObject(options) {
        var _this = this;
        this.type = 'displayObject';
        this.updateFlag = false;
        this.visible = true;
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.originX = 'left';
        this.originY = 'top';
        this.scaleX = 1;
        this.scaleY = 1;
        this.id = UID.gen();
        this.proxy = new Proxy(this, {
            get: function (target, key, receiver) {
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                Reflect.set(target, key, value, receiver);
                if (receiver.constructor.updateList.indexOf(String(key)) !== -1) {
                    _this.update(String(key));
                }
                return true;
            }
        });
        this.set(options);
        return this.proxy;
    }
    DisplayObject.prototype.update = function (key) {
        this.updateFlag = true;
    };
    DisplayObject.prototype.set = function (options) {
        if (typeof options === 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this[key] = options[key];
                }
            }
        }
    };
    DisplayObject.prototype.needUpdate = function () {
        return this.updateFlag;
    };
    DisplayObject.prototype.getWidth = function () {
        return abs(this.width * this.scaleX);
    };
    ;
    DisplayObject.prototype.getHeight = function () {
        return abs(this.height * this.scaleY);
    };
    ;
    DisplayObject.prototype.getOriginPoint = function () {
        var x = this.originX === 'center' ? this.width / 2
            : this.originX === 'right' ? this.width : 0;
        var y = this.originY === 'center' ? this.height / 2
            : this.originY === 'bottom' ? this.height : 0;
        x = abs(x * this.scaleX);
        y = abs(y * this.scaleY);
        return { x: x, y: y };
    };
    DisplayObject.updateList = ['visible', 'left', 'top', 'originX', 'originY'];
    return DisplayObject;
}());
export default DisplayObject;
//# sourceMappingURL=display-object.js.map