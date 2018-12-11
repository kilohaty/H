import DisplayObject from '../display/display-object';
import Bus from '../utils/bus';
declare class Stage {
    private container;
    private canvas;
    private ctx;
    private cacheCanvas;
    private cacheCtx;
    private lastMouseEnterObjectId;
    private forceRender;
    width: number;
    height: number;
    objects: Array<DisplayObject>;
    bus: Bus;
    constructor(options: {
        el: HTMLElement | string;
        width?: number;
        height?: number;
    });
    private loopAnim;
    private renderObjects;
    /**
     * add object to stage
     */
    add(...objects: DisplayObject[]): Stage;
    /**
     * remove object from stage by object id
     */
    remove(objectId: number): Stage;
    private initBus;
    private onMouseEnter;
    private onMouseMove;
    private onMouseDown;
    private onClick;
    private onMouseUp;
    private onMouseLeave;
    private onContextMenu;
    private getObjectById;
    private getObjectByPoint;
}
export default Stage;
