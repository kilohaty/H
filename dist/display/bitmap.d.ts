import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
import IPoint from '../utils/point';
export interface IBitmapOptions extends IDisplayObjectOptions {
    src: string;
}
export default class Bitmap extends DisplayObject {
    readonly type: string;
    private bitmapSource;
    src: string;
    static updateList: Array<string>;
    constructor(options: IBitmapOptions);
    protected update(key: string): Promise<void>;
    protected _render(ctx: CanvasRenderingContext2D): void;
    protected _isPointOnObject(point: IPoint): boolean;
}
