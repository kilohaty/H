import DisplayObject from '../display/display-object';
import Bus from '../utils/bus';
export default class Layer {
    private container;
    private canvas;
    private ctx;
    private cacheCanvas;
    private cacheCtx;
    private lastMouseEnterObjectId;
    layerIndex: number;
    width: number;
    height: number;
    objects: Array<DisplayObject>;
    bus: Bus;
    constructor(options: {
        container: HTMLElement;
        width: number;
        height: number;
        layerIndex: number;
    });
    add(...objects: DisplayObject[]): Layer;
    removeById(objectId: number): boolean;
    renderObjects(forceRender: boolean): void;
    on(type: string, fn: Function, onlyOnce?: boolean): Layer;
    onMouseEnter(e: any): void;
    onMouseMove(e: any): void;
    onMouseDown(e: any): void;
    onClick(e: any): void;
    onMouseUp(e: any): void;
    onMouseLeave(e: any): void;
    onContextMenu(e: any): void;
    private getObjectById;
    private getObjectByPoint;
}