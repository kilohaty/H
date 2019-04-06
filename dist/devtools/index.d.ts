import Bus from '../utils/bus';
import Stage from '../stage/stage';
declare const _default: {
    bus: Bus;
    EVENT_TP: {
        UPDATE_STAGE: string;
        UPDATE_OBJECT: string;
    };
    isEnable(): boolean;
    setStage(stage: Stage): void;
    getSelectedObjectId(): number;
};
export default _default;
