import Stage from './stage/stage';
import DisplayObject from './display/display-object';
import Bitmap from './display/bitmap';
import Text from './display/text';
import Polygon from './display/polygon';
import Sprite from './display/sprite';
declare const H: {
    Stage: typeof Stage;
    DisplayObject: typeof DisplayObject;
    Bitmap: typeof Bitmap;
    Text: typeof Text;
    Polygon: typeof Polygon;
    Sprite: typeof Sprite;
};
export default H;
