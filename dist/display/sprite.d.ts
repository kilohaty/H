import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
interface IStatusFrame {
    [index: number]: {
        x: number;
        y: number;
    };
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
    readonly type: string;
    private bitmapSource;
    private lastFrameTime;
    private frameIndex;
    private iteratedCount;
    src: string;
    frames: IFrames;
    status: string;
    static updateList: Array<string>;
    constructor(options: ISpriteOptions);
    protected update(key: string): Promise<void>;
    private reset;
    private isAnimationEnd;
    protected _render(ctx: CanvasRenderingContext2D): void;
    replay(): void;
}
export {};
