import DisplayObject from '../display/display-object';
import Bus from '../utils/bus'
import EventTypes from './event-types';
import IPoint from '../utils/point';

function createCanvas(width: number = 300, height: number = 150): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.setAttribute('width', String(width));
  canvas.setAttribute('height', String(height));
  canvas.style.cssText = 'position: absolute; top: 0; left: 0;';
  return canvas;
}

class Stage {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cacheCanvas: HTMLCanvasElement;
  private cacheCtx: CanvasRenderingContext2D;
  private lastMouseEnterObjectId: number = null;
  private forceRender: boolean = false;

  public width: number;
  public height: number;
  public objects: Array<DisplayObject> = [];
  public bus: Bus;

  public constructor(options: { el: HTMLElement | string, width?: number, height?: number }) {
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
    const canvas: HTMLCanvasElement = createCanvas(width, height);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.container.appendChild(canvas);

    // cache canvas
    const cacheCanvas = createCanvas(width, height);
    this.cacheCanvas = cacheCanvas;
    this.cacheCtx = cacheCanvas.getContext('2d');

    requestAnimationFrame(this.loopAnim.bind(this));

    this.initBus();
  }

  private loopAnim(): void {
    this.renderObjects();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  private renderObjects(): void {
    if (!this.forceRender
      && this.objects.every(el => !el.visible || !el.needUpdate())) {
      return;
    }
    this.cacheCtx.clearRect(0, 0, this.width, this.height);
    this.objects.forEach(el => el.render(this.cacheCtx));
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.cacheCanvas, 0, 0);
    this.forceRender = false;
  }

  /**
   * add object to stage
   */
  public add(...objects: DisplayObject[]): Stage {
    this.objects.push(...objects);

    return this;
  }

  /**
   * remove object from stage by object id
   */
  public remove(objectId: number): Stage {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === objectId) {
        this.objects.splice(i, 1);
        this.forceRender = true;
        break;
      }
    }

    return this;
  }

  private initBus(): void {
    this.bus = new Bus();
    this.container.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.container.addEventListener('click', this.onClick.bind(this));
    this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.container.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  private onMouseEnter(e): void {
    this.bus.emit(EventTypes.stage.mouseEnter, {e: e});
  }

  private onMouseMove(e): void {
    this.bus.emit(EventTypes.stage.mouseMove, {e: e});
    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});

    if (obj) {
      if (!this.lastMouseEnterObjectId) {
        this.bus.emit(EventTypes.object.mouseEnter, {e: e, object: obj});
      } else {
        if (this.lastMouseEnterObjectId !== obj.id) {
          const lastObj = this.getObjectById(this.lastMouseEnterObjectId);
          this.bus.emit(EventTypes.object.mouseLeave, {e: e, object: lastObj});
          this.bus.emit(EventTypes.object.mouseEnter, {e: e, object: obj});
        } else {
          this.bus.emit(EventTypes.object.mouseMove, {e: e, object: obj});
        }
      }
      this.lastMouseEnterObjectId = obj.id;
    } else {
      if (this.lastMouseEnterObjectId) {
        const lastObj = this.getObjectById(this.lastMouseEnterObjectId);
        this.bus.emit(EventTypes.object.mouseLeave, {e: e, object: lastObj});
      }
      this.lastMouseEnterObjectId = null;
    }
  }

  private onMouseDown(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.mouseDown, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.mouseDown, {e: e, object: obj});
    }
  }

  private onClick(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.click, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.click, {e: e, object: obj});
    }
  }

  private onMouseUp(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.mouseUp, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.mouseUp, {e: e, object: obj});
    }
  }

  private onMouseLeave(e): void {
    this.bus.emit(EventTypes.stage.mouseLeave, {e: e});
  }

  private onContextMenu(e): void {
    this.bus.emit(EventTypes.stage.contextMenu, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.contextMenu, {e: e, object: obj});
    }
  }

  private getObjectById(id: number): DisplayObject {
    return this.objects.find(obj => obj.id === id)
  }

  private getObjectByPoint(point: IPoint): DisplayObject {
    let obj = null;
    for (let i = this.objects.length - 1; i >= 0; i--) {
      if (this.objects[i].isPointOnObject(point)) {
        obj = this.objects[i];
        break;
      }
    }
    return obj;
  }
}

export default Stage;