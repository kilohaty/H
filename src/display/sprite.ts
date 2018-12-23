import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import {loadImage, isPointInRect} from '../utils/misc';
import IPoint from "../utils/point";

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

  private paused: boolean = false;
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
    this.paused = false;
  }

  private isAnimationEnd() {
    const frame = this.frames[this.status];
    return this.paused || frame.iterationCount && this.iteratedCount >= frame.iterationCount;
  }

  protected _render(ctx: CanvasRenderingContext2D): void {
    if (!this.bitmapSource) {
      this.updateFlag = false;
      return;
    }

    const now = Date.now();
    const frame = this.frames[this.status];
    const frameData = frame[this.frameIndex];
    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    ctx.save();
    ctx.translate(this.getLeft(), this.getTop());
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
      this.iteratedCount++;
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

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
    this.updateFlag = true;
  }

  public replay() {
    this.reset();
    this.updateFlag = true;
  }

  protected _isPointOnObject(point: IPoint): boolean {
    return isPointInRect(
      {
        left: this.getLeft(),
        top: this.getTop(),
        width: this.getWidth(),
        height: this.getHeight(),
        angle: 0,
      },
      point);
  }
}