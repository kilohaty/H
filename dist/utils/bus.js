var Bus = /** @class */ (function () {
    function Bus(id) {
        this.list = [];
        this.id = id || String(Date.now());
    }
    Bus.prototype.on = function (type, fn, onlyOnce) {
        if (onlyOnce === void 0) { onlyOnce = false; }
        if (!this.list[type]) {
            this.list[type] = [];
        }
        this.list[type].push({
            fn: fn,
            onlyOnce: onlyOnce
        });
        return this;
    };
    Bus.prototype.one = function (type, fn) {
        this.on(type, fn, true);
        return this;
    };
    Bus.prototype.off = function (type) {
        for (var i in this.list) {
            if (this.list.hasOwnProperty(i)) {
                if (type === i) {
                    this.list[type].length = 0;
                    break;
                }
            }
        }
        return this;
    };
    Bus.prototype.emit = function (type, data) {
        var eventLists = this.list[type];
        if (!eventLists || !eventLists.length) {
            return this;
        }
        for (var i = 0; i < eventLists.length; i++) {
            var fnInfo = eventLists[i];
            var fn = fnInfo.fn;
            var onlyOnce = fnInfo.onlyOnce;
            fn.call(this, data);
            if (onlyOnce) {
                eventLists.splice(i--, 1);
            }
        }
        return this;
    };
    return Bus;
}());
export default Bus;
//# sourceMappingURL=bus.js.map