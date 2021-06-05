import Layer from './layer';
declare class Stage {
    private container;
    private forceRender;
    private hookInit;
    private animationFrameId;
    private touchStartTime;
    private touchStartPoint;
    private eventHandlers;
    layers: Array<Layer>;
    width: number;
    height: number;
    throttleDelay: number;
    pageScale: number;
    containerRect: ClientRect;
    constructor(options: {
        el: HTMLElement | string;
        width?: number;
        height?: number;
        layerNumber?: number;
        throttleDelay: number;
        pageScale?: number;
    });
    setPageScale(scale: number): void;
    resize(width: number, height: number): void;
    private loopAnim;
    private renderObjects;
    private initEvents;
    private initMobileEvents;
    private calcMobileEventPosition;
    private removeEvents;
    private stopAnim;
    destroy(): void;
}
export default Stage;
