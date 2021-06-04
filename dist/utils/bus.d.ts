declare class Bus {
    private list;
    id: string | number;
    constructor(id?: string);
    on(type: string, fn: Function, onlyOnce?: boolean): Bus;
    one(type: string, fn: Function): Bus;
    off(type: string): Bus;
    emit(type: string, data: any): Bus;
    hasEvent(type: string): any;
}
export default Bus;
