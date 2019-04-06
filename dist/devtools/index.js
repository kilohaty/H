import Bus from '../utils/bus';
var HOOK_KEY = '__H_DEVTOOLS_HOOK__';
var bus = new Bus();
var EVENT_TP = {
    UPDATE_STAGE: 'UPDATE_STAGE',
    UPDATE_OBJECT: 'UPDATE_OBJECT'
};
function postMessage(type, data) {
    window.postMessage({
        name: 'h',
        type: type,
        data: data
    }, '*');
}
bus.on(EVENT_TP.UPDATE_STAGE, function (data) {
    if (window[HOOK_KEY]) {
        postMessage(EVENT_TP.UPDATE_STAGE, data);
    }
});
bus.on(EVENT_TP.UPDATE_OBJECT, function (data) {
    if (window[HOOK_KEY]) {
        postMessage(EVENT_TP.UPDATE_OBJECT, data);
    }
});
export default {
    bus: bus,
    EVENT_TP: EVENT_TP,
    isEnable: function () {
        return !!window[HOOK_KEY];
    },
    setStage: function (stage) {
        if (this.isEnable()) {
            window[HOOK_KEY].stage = stage;
        }
    },
    getSelectedObjectId: function () {
        if (this.isEnable()) {
            return window[HOOK_KEY].selectedObjectId;
        }
        return null;
    }
};
//# sourceMappingURL=index.js.map