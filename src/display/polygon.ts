import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import IPoint from '../utils/point';
import {degreesToRadians, isPointInPath} from '../utils/misc';

const {min, max} = Math;
const MIN_EDGE_NUMBER = 3;

export interface IPolygonOptions extends IDisplayObjectOptions {
  points: Array<IPoint>;
  lineWidth?: number;
  strokeColor?: number;
  fillColor?: number;
}

export default class Polygon extends DisplayObject {
  readonly type: string = 'polygon';

  public points: Array<IPoint> = [];
  public lineWidth: number = 1;
  public strokeColor: string = '#000000';
  public fillColor: string = 'transparent';

  public static updateList: Array<string> = [...DisplayObject.updateList, 'points', 'lineWidth', 'strokeColor', 'fillColor'];

  public constructor(options: IPolygonOptions) {
    super(null);
    this.set(options);
  }

  protected update(key: string) {
    if (key === 'points') {
      this.calcDimensions();
    }
    this.updateFlag = true;
  }

  private calcDimensions() {
    if (!this.points || this.points.length < MIN_EDGE_NUMBER) {
      return;
    }
    const minX = min(...this.points.map(p => p.x));
    const maxX = max(...this.points.map(p => p.x));
    const minY = min(...this.points.map(p => p.y));
    const maxY = max(...this.points.map(p => p.y));
    this.width = maxX - minX;
    this.height = maxY - minY;
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.points || this.points.length < MIN_EDGE_NUMBER) {
      this.updateFlag = false;
      return;
    }

    ctx.save();
    this.__render(ctx, true, true);
    ctx.restore();
    this.updateFlag = false;
  }

  private __render(ctx: CanvasRenderingContext2D, renderDebug: boolean = false, renderDevtoolsDebug: boolean = false) {
    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    if (this.angle) {
      ctx.translate(this.left, this.top);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.translate(this.getOriginLeft() - this.left, this.getOriginTop() - this.top);
    } else {
      ctx.translate(this.getOriginLeft(), this.getOriginTop());
    }
    ctx.scale(this.scaleX, this.scaleY);
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    this.points.forEach((point, index) => {
      ctx[index ? 'lineTo' : 'moveTo'](point.x + dstX, point.y + dstY);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    if (renderDebug) {
      this.renderDebug(ctx, dstX, dstY, this.width, this.height);
    }
    if (renderDevtoolsDebug) {
      this.renderDevtoolsDebug(ctx, dstX, dstY, this.width, this.height);
    }
  }

  protected _isPointOnObject(point: IPoint): boolean {
    return isPointInPath(point, this.__render.bind(this));
  }

}