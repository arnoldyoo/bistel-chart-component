import { ChartEventData } from './chart-event.interface';

interface EventMap { // indexable interface
    [type: string]: any;
}

export class EventDispatcher {
    private static Instance: EventDispatcher = null;
    private _eventMap: EventMap;

    public static getInstance(): EventDispatcher {
        if (EventDispatcher.Instance === null) {
            EventDispatcher.Instance = new EventDispatcher();
        }
        return EventDispatcher.Instance;
    }

    public addEventListener(type: string, method: any) {
        this._eventMap[type] = method;
    }

    public dispatchEvent(type: string, data: ChartEventData) {
        if (this._eventMap[type]) {
            this._eventMap[type](data);
        }
    }

    private constructor() {
        this._eventMap = {};
    }
}
