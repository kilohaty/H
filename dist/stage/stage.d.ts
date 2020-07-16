import Layer from './layer';
declare class Stage {
    private container;
    private forceRender;
    private hookInit;
    private animationFrameId;
    private eventHandlers;
    layers: Array<Layer>;
    width: number;
    height: number;
    throttleDelay: number;
    constructor(options: {
        el: HTMLElement | string;
        width?: number;
        height?: number;
        layerNumber?: number;
        throttleDelay: number;
    });
    resize(width: number, height: number): void;
    private loopAnim;
    private renderObjects;
    private initEvents;
    private removeEvents;
    private stopAnim;
    destroy(): void;
}
export default Stage;
