import UID from '../utils/uid';
var DisplayObject = /** @class */ (function () {
    function DisplayObject(options) {
        var _this = this;
        this.type = 'displayObject';
        this.updateList = ['visible', 'left', 'top'];
        this.updateFlag = false;
        this.visible = true;
        this.left = 0;
        this.top = 0;
        this.id = UID.gen();
        this.proxy = new Proxy(this, {
            get: function (target, key, receiver) {
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                Reflect.set(target, key, value, receiver);
                if (_this.updateList.indexOf(String(key)) !== -1) {
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
                    this.proxy[key] = options[key];
                }
            }
        }
    };
    DisplayObject.prototype.needUpdate = function () {
        return this.updateFlag;
    };
    return DisplayObject;
}());
export default DisplayObject;
//# sourceMappingURL=display-object.js.map