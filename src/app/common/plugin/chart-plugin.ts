import { IDisplay } from '../i-display.interface';
import { EventMap, ChartEventData } from '../event/index';

export abstract class ChartPlugin implements IDisplay {

    private _configuration: any;
    private _width: number;
    private _height: number;
    protected _eventMap: EventMap = {};


    constructor( config?: any ) {
        if (config) {
            this.configuration = config;
        }
    }

    set width(value: number) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height(): number {
        return this._height;
    }

    set configuration( value: any ) {
        this._configuration = value;
    }

    get configuration() {
        return this._configuration;
    }

    get events() {
        return [];
    }

    addEventListener(type: string, method: any) {
        this._eventMap[type] = method;
    }

    dispatchEvent(type: string, event: ChartEventData) {
        if (this._eventMap[type]) {
            this._eventMap[type](event);
        }
    }


    updateDisplay(width?: number, height?: number) {}

}
