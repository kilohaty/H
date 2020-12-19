import UID from '../utils/uid';
import IPoint from '../utils/point';

const {abs} = Math;

export interface IDisplayObjectOptions {
  id?: number;
  layerIndex?: number;
  visible?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  originX?: 'left' | 'center' | 'right';
  originY?: 'top' | 'center' | 'bottom';
  scaleX?: number;
  scaleY?: number;
  angle?: boolean;
  debug?: boolean;
}

export default abstract class DisplayObject {
  readonly type: string = 'displayObject';
  readonly id: number;
  readonly proxy: any;

  protected updateFlag: boolean = false;

  public layerIndex: number = 0;
  public visible: boolean = true;
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;
  public originX: 'left' | 'center' | 'right' = 'left';
  public originY: 'top' | 'center' | 'bottom' = 'top';
  public scaleX: number = 1;
  public scaleY: number = 1;
  public angle: number = 0;
  public opacity: number = 1;
  public debug: boolean = false;

  public static updateList: Array<string> =
    ['visible', 'left', 'top', 'originX', 'originY', 'scaleX', 'scaleY', 'angle', 'opacity', 'debug'];

  protected constructor(options: IDisplayObjectOptions) {
    this.id = options && options.id || UID.gen();
    this.proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        if (key === 'toJSON') {
          return function () {
            return Object.assign({}, target, {proxy: undefined});
          }
        }
        return Reflect.get(target, key, receiver);
      },
      set: (target, key, value, receiver) => {
        if (target[key] !== value) {
          Reflect.set(target, key, value, receiver);
          if (receiver.constructor.updateList.indexOf(key) !== -1) {
            this.update(<string>key);
          }
        }

        return true;
      }
    });
    this.set(options);

    return this.proxy;
  }

  protected update(key: string) {
    this.updateFlag = true;
  }

  public set(options: any) {
    if (typeof options === 'object') {
      for (let key in options) {
        if (options.hasOwnProperty(key) && key !== 'id') {
          this[key] = options[key];
        }
      }
    }
  }

  public needUpdate(): boolean {
    return this.updateFlag;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.visible) {
      this._render(ctx);
    }
  }

  protected abstract _render(ctx: CanvasRenderingContext2D): void;

  public isPointOnObject(point: IPoint): boolean {
    return this.visible
      ? this._isPointOnObject(point)
      : false;
  };

  protected abstract _isPointOnObject(point: IPoint): boolean;

  protected renderDebug(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    if (this.debug) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, y, width, height);
    }
  }

  protected renderDevtoolsDebug(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  }

  public getOriginLeft(): number {
    return this.originX === 'center' ? this.left - this.getWidth() / 2
      : this.originX === 'right' ? this.left - this.getWidth() : this.left;
  };

  public getOriginTop(): number {
    return this.originY === 'center' ? this.top - this.getHeight() / 2
      : this.originY === 'bottom' ? this.top - this.getHeight() : this.top;
  };

  public getWidth(): number {
    return abs(this.width * this.scaleX);
  };

  public getHeight(): number {
    return abs(this.height * this.scaleY);
  };
}
