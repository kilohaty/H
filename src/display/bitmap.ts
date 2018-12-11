import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import {loadImage, isPointInRect} from '../utils/misc';

export interface IBitmapOptions extends IDisplayObjectOptions {
  src: string;
}

export default class Bitmap extends DisplayObject {
  readonly type: string = 'bitmap';

  private bitmapSource: HTMLImageElement;

  public src: string;

  public static updateList: Array<string> = [...DisplayObject.updateList, 'src'];

  public constructor(options: IBitmapOptions) {
    super(null);
    this.set(options);
  }

  protected async update(key: string) {
    if (key === 'src') {
      try {
        this.bitmapSource = await loadImage(this.src);
        this.width = this.bitmapSource.width;
        this.height = this.bitmapSource.height;
        this.updateFlag = true;
      } catch (err) {
        console.error(err);
      }
      return;
    }

    this.updateFlag = true;
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.bitmapSource) {
      this.updateFlag = false;
      return;
    }

    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    ctx.save();
    ctx.translate(this.getLeft(), this.getTop());
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(this.bitmapSource, dstX, dstY);
    ctx.restore();

    this.updateFlag = false;
  }

  protected _isPointOnObject(point): boolean {
    if (!this.bitmapSource) return false;

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