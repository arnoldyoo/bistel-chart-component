/**
 * Created by airnold on 2017. 6. 19..
 */

import { IChartEvent } from './chart-event.interface';

export class ChartEvent implements IChartEvent {
    static ITEM_CLICK = 'itemclick';
    static MOUSE_OVER = 'mouseover';
    static MOUSE_OUT = 'mouseout';
    static MOUSE_DRAG = 'mousedrag';
    static MOUSE_DROP = 'mousedrop';
    static MOUSE_MOVE = 'mousemove';

    private _event: any;
    private _data: any;

    set event(value: any) {
        this._event = value;
    }

    get event() {
        return this._event;
    }

    set data(value: any) {
        this._data = value;
    }

    get data() {
        return this._data;
    }

    constructor(event: any, data: any) {
        this.event = event;
        this.data = data;
    }

}
