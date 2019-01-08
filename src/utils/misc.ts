import IPoint from './point';
import IRect from './rect';
import CCPool from './cache-canvas-pool';

const {PI, cos, sin} = Math;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve.bind(null, image);
    image.onerror = reject.bind(null);
    image.src = src;
  });
}

function degreesToRadians(degrees: number): number {
  return degrees * PI / 180;
}

function radiansToDegrees(radians: number): number {
  return radians * 180 / PI;
}

function rotatePoint(origin: IPoint, degrees: number, point: IPoint) {
  const x1 = point.x;
  const y1 = point.y;
  const x2 = origin.x;
  const y2 = origin.y;
  const radians = degreesToRadians(degrees);

  const x = (x1 - x2) * cos(radians) - (y1 - y2) * sin(radians) + x2;
  const y = (x1 - x2) * sin(radians) + (y1 - y2) * cos(radians) + y2;

  return {x: x, y: y};
}

function isPointInPath({x, y}: IPoint, renderFunction?: Function, points?: Array<IPoint>,): boolean {
  let res = false;
  CCPool.get(({ctx}) => {
    if (renderFunction) {
      renderFunction(ctx)
    } else {
      (points || []).forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p.x, p.y));
    }
    res = ctx.isPointInPath(x, y);
  });
  return res;
}

function isPointInRect(rect: IRect, {x, y}: IPoint) {
  if (rect.angle) {
    const renderFunction = function (ctx: CanvasRenderingContext2D) {
      ctx.translate(rect.rotateOriginLeft, rect.rotateOriginTop);
      ctx.rotate(degreesToRadians(rect.angle));
      ctx.translate(rect.left - rect.rotateOriginLeft, rect.top - rect.rotateOriginTop);
      ctx.rect(0, 0, rect.width, rect.height);
      ctx.stroke();
    };
    return isPointInPath({x: x, y: y}, renderFunction);
  }

  const left = rect.left;
  const right = rect.left + rect.width;
  const top = rect.top;
  const bottom = rect.top + rect.height;

  return x >= left && x <= right && y >= top && y <= bottom;
}

export {
  loadImage,
  degreesToRadians,
  radiansToDegrees,
  rotatePoint,
  isPointInPath,
  isPointInRect,
};