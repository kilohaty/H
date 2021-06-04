import Layer from './layer';
import {throttle} from '../utils/misc';

const LONG_PRESS_DISTANCE = 5

class Stage {
  private container: HTMLElement;
  private forceRender: boolean = false;
  private hookInit: boolean = false;
  private animationFrameId: number = null;
  private touchStartTime = 0;
  private touchStartPoint = { x: 0, y: 0 };
  private eventHandlers: { [propsName: string]: EventListener | EventListenerObject } = {};
  public layers: Array<Layer> = [];
  public width: number;
  public height: number;
  public throttleDelay: number;

  public constructor(options: { el: HTMLElement | string, width?: number, height?: number, layerNumber?: number, throttleDelay: number }) {
    const el = options.el;
    const width = +options.width || 300;
    const height = +options.height || 150;

    this.container = typeof el === 'string' ? document.querySelector(el) : el;
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
    this.container.style.position = 'relative';
    this.width = width;
    this.height = height;
    this.throttleDelay = options.throttleDelay || 0;

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
    this.initMobileEvents();
    this.animationFrameId = requestAnimationFrame(this.loopAnim.bind(this));
  }

  public resize(width: number, height: number): void {
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
    this.width = width;
    this.height = height;
    this.layers.forEach(layer => layer.resize(width, height));
    this.forceRender = true;
  }

  private loopAnim(): void {
    this.renderObjects();
    this.animationFrameId = requestAnimationFrame(this.loopAnim.bind(this));
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
          layer[layerFuncName].call(layer, e);
        }
      };
      const handler = doThrottle && this.throttleDelay ? throttle(this.throttleDelay, fn, false) : fn;
      this.eventHandlers[name] = handler;
      this.container.addEventListener(name, handler);
    })
  }

  private initMobileEvents() {
    // touchstart
    this.container.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      this.touchStartPoint = { x: touch.clientX, y: touch.clientY };
      this.touchStartTime = Date.now();
      const fn = (e) => {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          layer['onTouchStart'].call(layer, e);
        }
      };
      fn({ offsetX: ~~touch.clientX, offsetY: ~~touch.clientY });
    });

    // touchmove
    this.container.addEventListener('touchmove', (e) => {
      const touch = e.changedTouches[0];
      const fn = (e) => {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          layer['onTouchMove'].call(layer, e);
        }
      };
      const handler = this.throttleDelay ? throttle(this.throttleDelay, fn, false) : fn;
      handler({ offsetX: ~~touch.clientX, offsetY: ~~touch.clientY });
    });

    // touchend
    this.container.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const diffX = Math.abs(touch.clientX - this.touchStartPoint.x);
      const diffY = Math.abs(touch.clientY - this.touchStartPoint.y);
      const now = Date.now()
      if (now - this.touchStartTime > 500 && diffX < LONG_PRESS_DISTANCE && diffY < LONG_PRESS_DISTANCE) {
        const fn = (e) => {
          for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            layer['onLongTap'].call(layer, e);
          }
        };
        fn({ offsetX: ~~touch.clientX, offsetY: ~~touch.clientY });
      } else {
        const fn = (e) => {
          for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            layer['onTouchEnd'].call(layer, e);
          }
        };
        fn({ offsetX: ~~touch.clientX, offsetY: ~~touch.clientY });
      }
    });
  }

  private removeEvents(): void {
    for (let type in this.eventHandlers) {
      if (this.eventHandlers.hasOwnProperty(type)) {
        this.container.removeEventListener(type, this.eventHandlers[type]);
      }
    }
  }

  private stopAnim(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  public destroy() {
    this.stopAnim();
    this.removeEvents();
  }
}

export default Stage;
