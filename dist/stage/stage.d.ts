import DisplayObject from '../display/display-object';
declare class Stage {
    private container;
    private canvas;
    private ctx;
    private cacheCanvas;
    private cacheCtx;
    private forceRender;
    width: number;
    height: number;
    objects: Array<DisplayObject>;
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
    add(): Stage;
    /**
     * remove object from stage by object id
     */
    remove(objectId: number): Stage;
}
export default Stage;
