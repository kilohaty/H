import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
import IPoint from '../utils/point';
export interface ITextGradient {
    colorStops: Array<{
        percent: number;
        color: string;
    }>;
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
export default class Text extends DisplayObject {
    readonly type: string;
    text: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color: string;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    gradient: ITextGradient;
    static updateList: Array<string>;
    constructor(options: ITextOptions);
    protected update(key: string): void;
    private calcDimensions;
    protected _render(ctx: CanvasRenderingContext2D): void;
    protected _isPointOnObject(point: IPoint): boolean;
}
