import IPoint from './point';
import IRect from './rect';
declare function loadImage(src: string): Promise<HTMLImageElement>;
declare function degreesToRadians(degrees: number): number;
declare function radiansToDegrees(radians: number): number;
declare function rotatePoint(origin: IPoint, degrees: number, point: IPoint): {
    x: number;
    y: number;
};
declare function isPointInPath({ x, y }: IPoint, renderFunction?: Function, points?: Array<IPoint>): boolean;
declare function isPointInRect(rect: IRect, { x, y }: IPoint): boolean;
export { loadImage, degreesToRadians, radiansToDegrees, rotatePoint, isPointInPath, isPointInRect, };
