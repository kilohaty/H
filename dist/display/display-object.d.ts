import IPoint from '../utils/point';
export interface IDisplayObjectOptions {
    visible?: boolean;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    originX?: 'left' | 'center' | 'right';
    originY?: 'top' | 'center' | 'bottom';
    scaleX?: number;
    scaleY?: number;
    angle?: boolean;
    debug?: boolean;
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
    originX: 'left' | 'center' | 'right';
    originY: 'top' | 'center' | 'bottom';
    scaleX: number;
    scaleY: number;
    angle: number;
    debug: boolean;
    static updateList: Array<string>;
    protected constructor(options: IDisplayObjectOptions);
    protected update(key: string): void;
    set(options: any): void;
    needUpdate(): boolean;
    render(ctx: CanvasRenderingContext2D): void;
    protected abstract _render(ctx: CanvasRenderingContext2D): void;
    isPointOnObject(point: IPoint): boolean;
    protected abstract _isPointOnObject(point: IPoint): boolean;
    protected renderDebug(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
    getOriginLeft(): number;
    getOriginTop(): number;
    getWidth(): number;
    getHeight(): number;
}
