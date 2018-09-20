import DisplayObject from './display-object';
import { IDisplayObjectOptions } from './display-object';
export interface iTextOptions extends IDisplayObjectOptions {
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
    constructor(options: iTextOptions);
    protected update(key: string): Promise<void>;
    private calcDimensions;
    render(ctx: CanvasRenderingContext2D): void;
}
