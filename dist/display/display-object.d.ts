interface IDisplayObjectOptions {
    visible?: boolean;
    left?: number;
    top?: number;
}
export default abstract class DisplayObject {
    readonly type: string;
    readonly id: number;
    readonly proxy: any;
    readonly updateList: Array<string>;
    protected updateFlag: boolean;
    visible: boolean;
    left: number;
    top: number;
    protected constructor(options: IDisplayObjectOptions);
    protected update(key: string): void;
    set(options: any): void;
    needUpdate(): boolean;
    abstract render(ctx: CanvasRenderingContext2D): void;
}
export {};
