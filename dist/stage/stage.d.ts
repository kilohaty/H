import Layer from './layer';
declare class Stage {
    private container;
    private forceRender;
    private hookInit;
    layers: Array<Layer>;
    width: number;
    height: number;
    throttleDelay: number;
    constructor(options: {
        el: HTMLElement | string;
        width?: number;
        height?: number;
        layerNumber?: number;
    });
    private initDevtoolsBus;
    private loopAnim;
    private initHook;
    private renderObjects;
    private initEvents;
}
export default Stage;
