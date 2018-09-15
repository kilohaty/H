import UID from '../utils/uid';

export interface IDisplayObjectOptions {
  visible?: boolean;
  left?: number;
  top?: number;
}

export default abstract class DisplayObject {
  readonly type: string = 'displayObject';
  readonly id: number;
  readonly proxy: any;

  protected updateFlag: boolean = false;

  public visible: boolean = true;
  public left: number = 0;
  public top: number = 0;

  public static updateList: Array<string> = ['visible', 'left', 'top'];

  protected constructor(options: IDisplayObjectOptions) {
    this.id = UID.gen();
    this.proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        return Reflect.get(target, key, receiver);
      },
      set: (target, key, value, receiver) => {
        Reflect.set(target, key, value, receiver);
        if (receiver.constructor.updateList.indexOf(String(key)) !== -1) {
          this.update(String(key));
        }
        return true;
      }
    });
    this.set(options);

    return this.proxy;
  }

  protected update(key: string) {
    this.updateFlag = true;
  }

  public set(options: any) {
    if (typeof options === 'object') {
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          this[key] = options[key];
        }
      }
    }
  }

  public needUpdate(): boolean {
    return this.updateFlag;
  }

  public abstract render(ctx: CanvasRenderingContext2D): void

}
