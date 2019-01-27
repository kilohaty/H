import Bus from '../utils/bus';
import Stage from '../stage/stage'

const HOOK_KEY = '__H_DEVTOOLS_HOOK__';
const bus = new Bus();

const EVENT_TP = {
  UPDATE_STAGE: 'UPDATE_STAGE',
  UPDATE_OBJECT: 'UPDATE_OBJECT'
};

function postMessage(type: string, data: any) {
  window.postMessage({
    name: 'h',
    type: type,
    data: data
  }, '*');
}

bus.on(EVENT_TP.UPDATE_STAGE, (data) => {
  if (window[HOOK_KEY]) {
    postMessage(EVENT_TP.UPDATE_STAGE, data)
  }
});

bus.on(EVENT_TP.UPDATE_OBJECT, (data) => {
  if (window[HOOK_KEY]) {
    postMessage(EVENT_TP.UPDATE_OBJECT, data)
  }
});

export default {
  bus,

  EVENT_TP,

  isEnable(): boolean {
    return !!window[HOOK_KEY];
  },

  setStage(stage: Stage) {
    if (this.isEnable()) {
      window[HOOK_KEY].stage = stage;
    }
  },

  getSelectedObjectId(): number {
    if (this.isEnable()) {
      return window[HOOK_KEY].selectedObjectId
    }
    return null
  }
}