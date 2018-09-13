import UID from '../utils/uid';
export default class DisplayObject {
    constructor(options) {
        this.type = 'displayObject';
        this.updateList = ['visible', 'left', 'top'];
        this.updateFlag = false;
        this.visible = true;
        this.left = 0;
        this.top = 0;
        this.id = UID.gen();
        this.proxy = new Proxy(this, {
            get: (target, key, receiver) => {
                return Reflect.get(target, key, receiver);
            },
            set: (target, key, value, receiver) => {
                if (this.updateList.indexOf(String(key)) !== -1) {
                    this.updateFlag = true;
                }
                return Reflect.set(target, key, value, receiver);
            }
        });
        this.set(options);
        return this.proxy;
    }
    set(options) {
        if (typeof options === 'object') {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    this.proxy[key] = options[key];
                }
            }
        }
    }
    needUpdate() {
        return this.updateFlag;
    }
    render(ctx) {
        this.updateFlag = false;
    }
}
//# sourceMappingURL=display-object.js.map