export default class DisplayObject {
    readonly type: string;
    readonly id: number;
    readonly proxy: any;
    readonly updateList: Array<string>;
    private updateFlag;
    visible: boolean;
    left: number;
    top: number;
    constructor(options: {
        left: number;
        top: number;
    });
    set(options: any): void;
    needUpdate(): boolean;
    render(ctx: CanvasRenderingContext2D): void;
}
