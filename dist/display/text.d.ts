import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
export interface ITextOptions extends IDisplayObjectOptions {
    text?: string;
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: number;
    color?: string;
}
export default class Text extends DisplayObject {
    readonly type: string;
    text: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color: string;
    static updateList: Array<string>;
    constructor(options: ITextOptions);
    protected update(key: string): void;
    private calcDimensions;
    protected _render(ctx: CanvasRenderingContext2D): void;
}
