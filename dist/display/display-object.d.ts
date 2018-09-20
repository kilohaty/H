import IPoint from '../utils/point';
export interface IDisplayObjectOptions {
    visible?: boolean;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    originX?: string;
    originY?: string;
    scaleX?: number;
    scaleY?: number;
}
export default abstract class DisplayObject {
    readonly type: string;
    readonly id: number;
    readonly proxy: any;
    protected updateFlag: boolean;
    visible: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    originX: string;
    originY: string;
    scaleX: number;
    scaleY: number;
    static updateList: Array<string>;
    protected constructor(options: IDisplayObjectOptions);
    protected update(key: string): void;
    set(options: any): void;
    needUpdate(): boolean;
    abstract render(ctx: CanvasRenderingContext2D): void;
    getWidth(): number;
    getHeight(): number;
    getOriginPoint(): IPoint;
}
