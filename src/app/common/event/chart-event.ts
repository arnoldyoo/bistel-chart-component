/**
 * Created by airnold on 2017. 6. 19..
 */

import { IChartEvent, ChartEventData } from './chart-event.interface';

export class ChartEvent extends Event implements IChartEvent {
    static ITEM_CLICK = 'itemclick';
    static MOUSE_OVER = 'mouseover';
    static MOUSE_OUT = 'mouseout';
    static MOUSE_DRAG = 'mousedrag';
    static MOUSE_DROP = 'mousedrop';
    static MOUSE_MOVE = 'mousemove';

    private _type: string; // event type name
    // private _event: any; // event object
    private _data: ChartEventData; // send data

    set type(value: string) {
        this._type = value;
    }

    get type() {
        return this._type;
    }

    // set event(value: any) {
    //     this._event = value;
    // }
    //
    // get event() {
    //     return this._event;
    // }

    set data(value: ChartEventData) {
        this._data = value;
    }

    get data() {
        return this._data;
    }

    constructor(type: string, data: ChartEventData) {
        super(type);
        this.type = type;
        // this.event = event;
        this.data = data;
    }

}
