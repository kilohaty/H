let cacheCanvasId = 1;

enum Status {
  Free = 0,
  Busy = 1
}

export default class CacheCanvas {
  readonly id: number = 1;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private width: number = 1;
  private height: number = 1;
  private status: Status = Status.Free;

  constructor() {
    this.id = cacheCanvasId++;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  isFree(): boolean {
    return this.status === Status.Free;
  }

  setWidth(width: number) {
    this.canvas.width = width;
  }

  setHeight(height: number) {
    this.canvas.height = height;
  }

  setFree() {
    this.status = Status.Free;
  }

  setBusy() {
    this.status = Status.Busy;
  }
}