export default class CacheCanvas {
    readonly id: number;
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    private width;
    private height;
    private status;
    constructor();
    isFree(): boolean;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setFree(): void;
    setBusy(): void;
}
