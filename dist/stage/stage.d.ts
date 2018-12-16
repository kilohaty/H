import Layer from './layer';
declare class Stage {
    private container;
    private forceRender;
    layers: Array<Layer>;
    width: number;
    height: number;
    constructor(options: {
        el: HTMLElement | string;
        width?: number;
        height?: number;
        layerNumber?: number;
    });
    private loopAnim;
    private renderObjects;
    private initEvents;
}
export default Stage;
