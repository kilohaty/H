import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
import IPoint from '../utils/point';
export interface IPolygonOptions extends IDisplayObjectOptions {
    points: Array<IPoint>;
    lineWidth?: number;
    strokeColor?: number;
    fillColor?: number;
}
export default class Polygon extends DisplayObject {
    readonly type: string;
    points: Array<IPoint>;
    lineWidth: number;
    strokeColor: string;
    fillColor: string;
    static updateList: Array<string>;
    constructor(options: IPolygonOptions);
    protected update(key: string): void;
    private calcDimensions;
    protected _render(ctx: CanvasRenderingContext2D): void;
}
