import Stage from './stage/stage';
import DisplayObject from './display/display-object';
import Bitmap from './display/bitmap';
import Text from './display/text';
import Polygon from './display/polygon';
import Sprite from './display/sprite';
import Group from './display/group';
declare const H: {
    Stage: typeof Stage;
    DisplayObject: typeof DisplayObject;
    Bitmap: typeof Bitmap;
    Text: typeof Text;
    Polygon: typeof Polygon;
    Sprite: typeof Sprite;
    Group: typeof Group;
    EventTypes: {
        stage: {
            mouseEnter: string;
            mouseMove: string;
            mouseLeave: string;
            mouseDown: string;
            click: string;
            mouseUp: string;
            contextMenu: string;
            touchstart: string;
            touchmove: string;
            touchend: string;
            touchcancel: string;
            longTap: string;
        };
        object: {
            mouseEnter: string;
            mouseMove: string;
            mouseLeave: string;
            mouseDown: string;
            click: string;
            mouseUp: string;
            contextMenu: string;
            touchstart: string;
            touchmove: string;
            touchend: string;
            touchcancel: string;
            longTap: string;
        };
    };
};
export default H;
