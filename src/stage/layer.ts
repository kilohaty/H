import DisplayObject from '../display/display-object';
import Bus from '../utils/bus';
import EventTypes from './event-types';
import IPoint from '../utils/point';

function createCanvas(width: number = 300, height: number = 150, zIndex: number = 0): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.setAttribute('width', String(width));
  canvas.setAttribute('height', String(height));
  canvas.style.cssText = `position: absolute; z-index: ${zIndex}; top: 0; left: 0;`;
  return canvas;
}

export default class Layer {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cacheCanvas: HTMLCanvasElement;
  private cacheCtx: CanvasRenderingContext2D;
  private lastMouseEnterObjectId: number = null;

  public layerIndex: number;
  public width: number;
  public height: number;
  public objects: Array<DisplayObject> = [];
  public bus: Bus;

  constructor(options: { container: HTMLElement, width: number, height: number, layerIndex: number}) {
    this.container = options.container;
    this.width = options.width;
    this.height = options.height;
    this.layerIndex = options.layerIndex;
    this.bus = new Bus();

    // canvas
    const canvas: HTMLCanvasElement = createCanvas(this.width, this.height, this.layerIndex);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.container.appendChild(canvas);

    // cache canvas
    const cacheCanvas = createCanvas(this.width, this.height);
    this.cacheCanvas = cacheCanvas;
    this.cacheCtx = cacheCanvas.getContext('2d');
  }

  public add(...objects: DisplayObject[]): Layer {
    this.objects.push(...objects);

    return this;
  }

  public removeById(objectId: number): boolean {
    let removed = false;
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === objectId) {
        this.objects.splice(i, 1);
        removed = true;
        break;
      }
    }

    return removed;
  }

  public renderObjects(forceRender: boolean): void {
    const shouldRender = this.objects.some(object => {
      return object.visible && object.needUpdate();
    });
    if (forceRender || shouldRender) {
      this.cacheCtx.clearRect(0, 0, this.width, this.height);
      this.objects.forEach(el => el.render(this.cacheCtx));
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.cacheCanvas, 0, 0);
    }
  }

  public on(type: string, fn: Function, onlyOnce: boolean = false): void {
    this.bus.on(type, fn, onlyOnce);
  }

  public onMouseEnter(e): void {
    this.bus.emit(EventTypes.stage.mouseEnter, {e: e});
  }

  public onMouseMove(e): void {
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

  public onMouseDown(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.mouseDown, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.mouseDown, {e: e, object: obj});
    }
  }

  public onClick(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.click, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.click, {e: e, object: obj});
    }
  }

  public onMouseUp(e): void {
    if (e.button === 2) return;

    this.bus.emit(EventTypes.stage.mouseUp, {e: e});

    const obj = this.getObjectByPoint({x: e.offsetX, y: e.offsetY});
    if (obj) {
      this.bus.emit(EventTypes.object.mouseUp, {e: e, object: obj});
    }
  }

  public onMouseLeave(e): void {
    this.bus.emit(EventTypes.stage.mouseLeave, {e: e});
  }

  public onContextMenu(e): void {
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