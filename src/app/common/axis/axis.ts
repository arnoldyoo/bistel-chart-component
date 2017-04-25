import { Axe } from './axe';
import { IDisplay } from './../iDisplay.interface';
import { Generator } from './../generator';

export class Axis implements IDisplay {

    axis: any;
    dataType: string;
    field: string;
    format: any;
    visible: boolean;
    title: string;
    domain: Array<any>;
    axe: Axe;
    _generator: Generator;

    constructor() {
        this._generator = new Generator();
    }


    // IDisplay interface getter setter
    set width(width: number) {

    }
    get width() {
        return;
    }

    set height(height: number) {

    }
    get height() {
        return;
    }

    updateDisplay(width: number, height: number): void {

    }
    createAxis(): void {
        this.axis = this._generator.createAxis({});
    }
    makeAxisLabel(): void {

    }
}
