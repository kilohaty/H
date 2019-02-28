import Layer from './layer';
import devtools from '../devtools';
import config from '../config';
import {throttle} from '../utils/misc';

class Stage {
  private container: HTMLElement;
  private forceRender: boolean = false;
  private hookInit: boolean = false;
  public layers: Array<Layer> = [];
  public width: number;
  public height: number;
  public throttleDelay: number = 100;

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
    this.initDevtoolsBus();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  private initDevtoolsBus(): void {
    devtools.bus.on('update.stage', () => {
      if (devtools.isEnable()) {
        devtools.bus.emit(devtools.EVENT_TP.UPDATE_STAGE, JSON.stringify(this));
      }
    });
  }

  private loopAnim(): void {
    this.renderObjects();
    this.initHook();
    requestAnimationFrame(this.loopAnim.bind(this));
  }

  private initHook() {
    if (!config.devtools.enable) {
      return
    }

    if (this.hookInit) {
      return;
    }

    if (devtools.isEnable()) {
      devtools.setStage(this);
      devtools.bus.emit(devtools.EVENT_TP.UPDATE_STAGE, JSON.stringify(this));
      this.hookInit = true;
    }
  }

  private renderObjects(): void {
    this.layers.forEach(layer => {
      layer.renderObjects(this.forceRender || layer.forceRender);
      layer.forceRender = false
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
        layerFuncName: 'onMouseMove',
        throttle: true
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

    eventMap.forEach(({name, layerFuncName, throttle: doThrottle}) => {
      const fn = (e) => {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          layer[layerFuncName].call(layer, e)
        }
      };
      const handler = doThrottle ? throttle(this.throttleDelay, fn, false) : fn;
      this.container.addEventListener(name, handler);
    })
  }

}

export default Stage;
