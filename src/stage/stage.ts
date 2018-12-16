import Layer from './layer';

class Stage {
  private container: HTMLElement;
  private forceRender: boolean = false;
  public layers: Array<Layer> = [];
  public width: number;
  public height: number;

  public constructor(options: { el: HTMLElement | string, width?: number, height?: number, layerNumber?: number }) {
    const el = options.el;
    const width = +options.width || 300;
    const height = +options.height || 150;

    this.container = typeof el === 'string' ? document.querySelector(el) : el;
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
    this.container.style.position = 'relative';
    this.width = width;
    this.height = height;

    for (let i = 0; i < (options.layerNumber || 1); i++) {
      const layer = new Layer({
        container: this.container,
        width: this.width,
        height: this.height,
        layerIndex: i
      });
      this.layers.push(layer)
    }

    this.initEvents();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  private loopAnim(): void {
    this.renderObjects();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  private renderObjects(): void {
    this.layers.forEach(layer => {
      layer.renderObjects(this.forceRender);
    });
    this.forceRender = false;
  }

  private initEvents(): void {
    const eventMap = [
      {
        name: 'mouseenter',
        layerFuncName: 'onMouseEnter'
      },
      {
        name: 'mousemove',
        layerFuncName: 'onMouseMove'
      },
      {
        name: 'mousedown',
        layerFuncName: 'onMouseDown'
      },
      {
        name: 'click',
        layerFuncName: 'onClick'
      },
      {
        name: 'mouseup',
        layerFuncName: 'onMouseUp'
      },
      {
        name: 'mouseleave',
        layerFuncName: 'onMouseLeave'
      },
      {
        name: 'contextmenu',
        layerFuncName: 'onContextMenu'
      },
    ];

    eventMap.forEach(({name, layerFuncName}) => {
      this.container.addEventListener(name, e => {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          layer[layerFuncName].call(layer, e)
        }
      });
    })
  }

}

export default Stage;
