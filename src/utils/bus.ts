interface IBusItem {
  fn: Function;
  onlyOnce: boolean;
}

class Bus {
  private list: Array<IBusItem> = [];
  public id: string | number;

  constructor(id?: string) {
    this.id = id || String(Date.now());
  }

  on(type: string, fn: Function, onlyOnce: boolean = false): Bus {
    if (!this.list[type]) {
      this.list[type] = [];
    }

    this.list[type].push({
      fn: fn,
      onlyOnce: onlyOnce
    });

    return this;
  }

  one(type: string, fn: Function): Bus {
    this.on(type, fn, true);
    return this;
  }

  off(type: string): Bus {
    for (let i in this.list) {
      if (this.list.hasOwnProperty(i)) {
        if (type === i) {
          this.list[type].length = 0;
          break;
        }
      }
    }
    return this;
  }

  emit(type: string, data: any): Bus {
    const eventLists = this.list[type];

    if (!eventLists || !eventLists.length) {
      return this;
    }

    for (let i = 0; i < eventLists.length; i++) {
      const fnInfo = eventLists[i];
      const fn = fnInfo.fn;
      const onlyOnce = fnInfo.onlyOnce;

      fn.call(this, data);
      if (onlyOnce) {
        eventLists.splice(i--, 1);
      }
    }

    return this;
  }
}

export default Bus;
