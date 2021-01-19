import DisplayObject from './display-object'
import { IDisplayObjectOptions } from './display-object'
import { loadImage, isPointInRect, degreesToRadians } from '../utils/misc'
import IPoint from '../utils/point'

export interface IBitmapOptions extends IDisplayObjectOptions {
  src: string;
}

export default class Group extends DisplayObject {
  readonly type: string = 'group'

  public objects: Array<DisplayObject>
  public src: string

  public static updateList: Array<string> = [...DisplayObject.updateList, 'objects']

  public constructor (options: IBitmapOptions) {
    super(null)
    this.set(options)
  }

  protected async update (key: string) {
    this.updateFlag = true
  }

  protected _render (ctx: CanvasRenderingContext2D): void {
    this.objects.forEach((object) => {
      ctx.save()
      if (this.angle) {
        ctx.translate(this.left, this.top)
        ctx.rotate(degreesToRadians(this.angle))
        ctx.translate(this.getOriginLeft() - this.left, this.getOriginTop() - this.top)
      } else {
        ctx.translate(this.getOriginLeft(), this.getOriginTop())
      }
      ctx.scale(this.scaleX, this.scaleY)
      object.render(ctx)
      ctx.restore()
    })

    this.updateFlag = false
    this.updateDimensions()
  }

  private updateDimensions () {
    const objectsLeft = this.objects.map((object: DisplayObject) => {
      return object.getOriginLeft()
    })
    const objectsRight = this.objects.map((object: DisplayObject) => {
      return object.getOriginLeft() + object.getWidth()
    })
    const objectsTop = this.objects.map((object: DisplayObject) => {
      return object.getOriginTop()
    })
    const objectsBottom = this.objects.map((object: DisplayObject) => {
      return object.getOriginTop() + object.getHeight()
    })
    const minLeft = Math.min(...objectsLeft)
    const maxRight = Math.max(...objectsRight)
    const minTop = Math.min(...objectsTop)
    const maxBottom = Math.max(...objectsBottom)
    this.width = maxRight - minLeft
    this.height = maxBottom - minTop
  }

  public getUpdateFlag () {
    return this.updateFlag || this.objects.some((object) => object.getUpdateFlag())
  }

  protected _isPointOnObject (point: IPoint): boolean {
    return isPointInRect(
      {
        rotateOriginLeft: this.left,
        rotateOriginTop: this.top,
        left: this.getOriginLeft(),
        top: this.getOriginTop(),
        width: this.getWidth(),
        height: this.getHeight(),
        angle: this.angle
      },
      point)
  }
}