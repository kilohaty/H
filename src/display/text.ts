import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import IPoint from '../utils/point';
import {degreesToRadians, isPointInRect} from '../utils/misc';
import TextHelper from '../utils/text-helper';

export interface ITextGradient {
  colorStops: Array<{ percent: number, color: string }>
}

export interface ITextOptions extends IDisplayObjectOptions {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: number;
  color?: string;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  gradient?: ITextGradient;
}

const DEFAULT_FONT_FAMILY = '"PingFang SC", Verdana, "Helvetica Neue", "Microsoft Yahei", "Hiragino Sans GB", "Microsoft Sans Serif", "WenQuanYi Micro Hei", sans-serif';

export default class Text extends DisplayObject {
  readonly type: string = 'text';

  public text: string;
  public fontSize: number = 14;
  public fontWeight: string = 'normal';
  public fontFamily: string = DEFAULT_FONT_FAMILY;
  public color: string = '#000000';
  public shadowColor: string = '';
  public shadowOffsetX: number = 0;
  public shadowOffsetY: number = 0;
  public shadowBlur: number = 0;
  public gradient: ITextGradient = null;

  public static updateList: Array<string> = [...DisplayObject.updateList,
    'text', 'fontSize', 'fontWeight', 'fontFamily', 'color', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'gradient'];

  public constructor(options: ITextOptions) {
    super(null);
    this.set(options);
  }

  protected update(key: string) {
    if (['text', 'fontSize', 'fontWeight', 'fontFamily'].indexOf(key) !== -1) {
      this.calcDimensions();
    }
    this.updateFlag = true;
  }

  private calcDimensions() {
    if (!this.text || !this.fontSize) {
      this.width = this.height = 0;
      return;
    }

    const cssText = `
      font-family: ${this.fontFamily};
      font-size: ${this.fontSize}px;
      font-weight: ${this.fontWeight};
    `;
    const dimensions = TextHelper.measureText(this.text, cssText);
    this.width = dimensions.width;
    this.height = dimensions.height;
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    ctx.save();
    if (this.opacity !== 1) {
      ctx.globalAlpha = this.opacity || 1;
    }
    if (this.angle) {
      ctx.translate(this.left, this.top);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.translate(this.getOriginLeft() - this.left, this.getOriginTop() - this.top);
    } else {
      ctx.translate(this.getOriginLeft(), this.getOriginTop());
    }
    ctx.scale(this.scaleX, this.scaleY);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let gradient
    if (this.gradient) {
      gradient = ctx.createLinearGradient(0,0, this.width,this.height);
      this.gradient.colorStops.forEach(({ percent, color}) => {
        gradient.addColorStop(percent, color);
      })
    }

    if (this.shadowColor) {
      ctx.shadowColor = this.shadowColor;
      ctx.shadowOffsetX = this.shadowOffsetX;
      ctx.shadowOffsetY = this.shadowOffsetY;
      ctx.shadowBlur = this.shadowBlur;
    }
    ctx.fillStyle = this.gradient ? gradient : this.color;
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillText(this.text, dstX, dstY);
    this.renderDebug(ctx, dstX, dstY, this.width, this.height);
    this.renderDevtoolsDebug(ctx, dstX, dstY, this.width, this.height);
    ctx.restore();

    this.updateFlag = false;
  }

  protected _isPointOnObject(point: IPoint): boolean {
    return isPointInRect(
      {
        rotateOriginLeft: this.left,
        rotateOriginTop: this.top,
        left: this.getOriginLeft(),
        top: this.getOriginTop(),
        width: this.getWidth(),
        height: this.getHeight(),
        angle: this.angle
      },
      point);
  }

}