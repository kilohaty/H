import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import {loadImage} from '../utils/misc';

interface IStatusFrame {
  [index: number]: { x: number, y: number };

  length: number;
  src?: string;
  frameWidth: number;
  frameHeight: number;
  frameDuration: number;
  iterationCount?: number;
}

interface IFrames {
  [propName: string]: IStatusFrame;
}

export interface ISpriteOptions extends IDisplayObjectOptions {
  src?: string;
  frames: IFrames;
  status: string;
}

export default class Sprite extends DisplayObject {
  readonly type: string = 'sprite';

  private bitmapSource: HTMLImageElement;
  private lastFrameTime: number = 0;
  private frameIndex: number = 0;
  private iteratedCount: number = 0;

  public src: string;
  public frames: IFrames;
  public status: string;

  public static updateList: Array<string> = [...DisplayObject.updateList, 'src', 'frames', 'status'];

  public constructor(options: ISpriteOptions) {
    super(null);
    this.set(options);
  }

  protected async update(key: string) {
    if (key === 'src') {
      try {
        this.bitmapSource = await loadImage(this.src);
        const frame = this.frames[this.status];
        this.width = frame.frameWidth;
        this.height = frame.frameHeight;
        this.reset();
        this.updateFlag = true;
      } catch (err) {
        console.error(err);
      }
      return;
    }

    if (key === 'status') {
      const frame = this.frames[this.status];
      if (!frame.src || frame.src === this.src) {
        this.width = frame.frameWidth;
        this.height = frame.frameHeight;
        this.reset();
      } else {
        this.src = frame.src;
      }
    }

    this.updateFlag = true;
  }

  private reset() {
    this.lastFrameTime = 0;
    this.frameIndex = 0;
    this.iteratedCount = 0;
  }

  private isAnimationEnd() {
    const frame = this.frames[this.status];
    return frame.iterationCount && this.iteratedCount > frame.iterationCount;
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.bitmapSource) {
      this.updateFlag = false;
      return;
    }

    const now = Date.now();
    const frame = this.frames[this.status];
    const frameData = frame[this.frameIndex];
    const {x: ox, y: oy} = this.getOriginPoint();
    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    ctx.save();
    ctx.translate(this.left - ox, this.top - oy);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(
      this.bitmapSource,
      frameData.x,
      frameData.y,
      this.width,
      this.height,
      dstX,
      dstY,
      this.width,
      this.height);
    ctx.restore();

    if (!this.lastFrameTime) {
      this.lastFrameTime = now;
    } else if (now - this.lastFrameTime >= frame.frameDuration) {
      this.frameIndex++;
      this.lastFrameTime = now;
      if (this.frameIndex >= frame.length) {
        this.frameIndex = 0;
        this.iteratedCount++;
      }
    }

    this.updateFlag = !this.isAnimationEnd();
  }

  public replay() {
    this.reset();
    this.updateFlag = true;
  }
}