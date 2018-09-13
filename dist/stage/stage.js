function createCanvas(width = 300, height = 150) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', String(width));
    canvas.setAttribute('height', String(height));
    canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
    return canvas;
}
class Stage {
    constructor(options) {
        this.forceRender = false;
        this.objects = [];
        const el = options.el;
        const width = +options.width || 300;
        const height = +options.height || 150;
        // canvas container
        this.container = typeof el === 'string' ? document.querySelector(el) : el;
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.position = 'relative';
        this.width = width;
        this.height = height;
        // canvas
        const canvas = createCanvas(width, height);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.container.appendChild(canvas);
        // cache canvas
        const cacheCanvas = createCanvas(width, height);
        this.cacheCanvas = cacheCanvas;
        this.cacheCtx = cacheCanvas.getContext('2d');
        requestAnimationFrame(this.loopAnim.bind(this));
    }
    loopAnim() {
        this.renderObjects();
        requestAnimationFrame(this.loopAnim.bind(this));
    }
    renderObjects() {
        if (!this.forceRender
            && this.objects.every(el => !el.visible || !el.needUpdate())) {
            return;
        }
        this.cacheCtx.clearRect(0, 0, this.width, this.height);
        this.objects.forEach(el => {
            el.visible && el.render(this.cacheCtx);
        });
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.cacheCanvas, 0, 0);
        this.forceRender = false;
    }
    /**
     * add object to stage
     */
    add() {
        this.objects.push(...arguments);
        return this;
    }
    /**
     * remove object from stage by object id
     */
    remove(objectId) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === objectId) {
                this.objects.splice(i, 1);
                this.forceRender = true;
                break;
            }
        }
        return this;
    }
}
export default Stage;
//# sourceMappingURL=stage.js.map