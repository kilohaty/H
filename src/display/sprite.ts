import DisplayObject from './display-object';
import {IDisplayObjectOptions} from './display-object';
import {loadImage, isPointInRect, degreesToRadians} from '../utils/misc';
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

interface IStatusEndCallbacks {
  [propsName: string]: Array<{ fn: Function, onlyOnce: boolean }>
}

export default class Sprite extends DisplayObject {
  readonly type: string = 'sprite';

  private paused: boolean = false;
  private bitmapSource: HTMLImageElement;
  private lastFrameTime: number = 0;
  private frameIndex: number = 0;
  private iteratedCount: number = 0;
  private statusEndCallbacks: IStatusEndCallbacks = {};

  public src: string;
  public frames: IFrames;
  public status: string;
  public playbackRate: number = 1;

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

  public setStatus(status: string, animationEndCallback: Function, onlyOnce: boolean = true): Sprite {
    if (animationEndCallback) {
      this.addStatusEndCallback(status, animationEndCallback, onlyOnce);
    }

    this.status = status;

    return this
  }

  private addStatusEndCallback(status: string, callbackFn: Function, onlyOnce: boolean) {
    if (!this.statusEndCallbacks[status]) {
      this.statusEndCallbacks[status] = [];
    }
    this.statusEndCallbacks[status].push({
      fn: callbackFn,
      onlyOnce: onlyOnce
    });
  }

  private onStatusEnd(status: string) {
    const callbacks = this.statusEndCallbacks[status];

    if (!callbacks || !callbacks.length) {
      return;
    }

    for (let i = 0; i < callbacks.length; i++) {
      const {fn, onlyOnce} = callbacks[i];
      if (onlyOnce) {
        callbacks.splice(i--, 1);
      }
      fn && fn();
    }
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
    if (this.isAnimationEnd()) {
      this.frameIndex = frame.length - 1
    }
    const frameData = frame[this.frameIndex];
    let dstX = this.scaleX < 0 ? -this.width : 0;
    let dstY = this.scaleY < 0 ? -this.height : 0;

    ctx.save();
    if (this.angle) {
      ctx.translate(this.left, this.top);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.translate(this.getOriginLeft() - this.left, this.getOriginTop() - this.top);
    } else {
      ctx.translate(this.getOriginLeft(), this.getOriginTop());
    }
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
    this.renderDebug(ctx, dstX, dstY, this.width, this.height);
    this.renderDevtoolsDebug(ctx, dstX, dstY, this.width, this.height);
    ctx.restore();

    if (!this.lastFrameTime) {
      this.lastFrameTime = now;
      this.frameIndex++;
    } else if (now - this.lastFrameTime >= frame.frameDuration / this.playbackRate) {
      this.lastFrameTime = now;
      this.frameIndex++;
    }

    if (this.frameIndex >= frame.length) {
      this.frameIndex = 0;
      this.iteratedCount++;
    }

    this.updateFlag = !this.isAnimationEnd();

    if (!this.updateFlag) {
      this.onStatusEnd(this.status);
    }
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
