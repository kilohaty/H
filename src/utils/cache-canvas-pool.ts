import CacheCanvas from './cache-canvas';

export default (function () {
  const pool: Array<CacheCanvas> = [];

  return {
    get(fn: Function, width?: number, height?: number) {
      let cc = pool.find(cc => cc.isFree());
      if (!cc) {
        cc = new CacheCanvas();
        pool.push(cc);
      }
      cc.setBusy();
      cc.setWidth(width || 1);
      cc.setHeight(height || 1);
      cc.ctx.save();
      fn(cc, () => {
        cc.ctx.restore();
        cc.setFree();
      });
    }
  };
}());