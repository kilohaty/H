import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import IPoint from '../utils/point';
import {isPointInRect} from '../utils/misc';
import TextHelper from '../utils/text-helper';

export interface ITextOptions extends IDisplayObjectOptions {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: number;
  color?: string;
}

const DEFAULT_FONT_FAMILY = '"PingFang SC", Verdana, "Helvetica Neue", "Microsoft Yahei", "Hiragino Sans GB", "Microsoft Sans Serif", "WenQuanYi Micro Hei", sans-serif';

export default class Text extends DisplayObject {
  readonly type: string = 'text';

  public text: string;
  public fontSize: number = 14;
  public fontWeight: string = 'normal';
  public fontFamily: string = DEFAULT_FONT_FAMILY;
  public color: string = '#000000';

  public static updateList: Array<string> = [...DisplayObject.updateList, 'text', 'fontSize', 'fontWeight', 'fontFamily', 'color'];

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
    ctx.translate(this.getLeft(), this.getTop());
    ctx.scale(this.scaleX, this.scaleY);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.fillText(this.text, dstX, dstY);
    ctx.strokeRect(dstX, dstY, this.width, this.height);
    ctx.restore();

    this.updateFlag = false;
  }

  protected _isPointOnObject(point: IPoint): boolean {
    return isPointInRect(
      {
        left: this.getLeft(),
        top: this.getTop(),
        width: this.getWidth(),
        height: this.getHeight(),
        angle: 0
      },
      point);
  }

}