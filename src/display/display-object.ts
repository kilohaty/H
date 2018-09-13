import UID from '../utils/uid';

export default class DisplayObject {
  readonly type: string = 'displayObject';
  readonly id: number;
  readonly proxy: any;
  readonly updateList: Array<string> = ['visible', 'left', 'top'];

  private updateFlag: boolean = false;

  public visible: boolean = true;
  public left: number = 0;
  public top: number = 0;

  public constructor(options: { left: number, top: number }) {
    this.id = UID.gen();
    this.proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver);
      },
      set: (target, key, value, receiver) => {
        if (this.updateList.indexOf(String(key)) !== -1) {
          this.updateFlag = true;
        }
        return Reflect.set(target, key, value, receiver);
      }
    });
    this.set(options);

    return this.proxy;
  }

  public set(options: any) {
    if (typeof options === 'object') {
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          this.proxy[key] = options[key];
        }
      }
    }
  }

  public needUpdate(): boolean {
    return this.updateFlag;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.updateFlag = false;
  }

}
