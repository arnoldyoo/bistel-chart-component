import { Axe } from './axe';
import { IDisplay } from './../iDisplay.interface';

export class Axis implements IDisplay {

    axis: any;
    dataType: string;
    field: string;
    format: any;
    visible: boolean;
    title: string;
    domain: Array<any>;
    axe: Axe;

    _width: number;
    _height: number;

    constructor() {}


    // IDisplay interface getter setter
    set width(value: number) {
        this._width = value;
    }
    get width() {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }
    get height() {
        return this._height;
    }

    updateDisplay(width: number, height: number): void {

    }
    createAxis(): void { }
    makeAxisLabel(): void { }

}
