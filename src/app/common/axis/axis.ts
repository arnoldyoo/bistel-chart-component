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

    constructor() {}


    // IDisplay interface getter setter
    set width(width: number) {
        this.width = width;
    }
    get width() {
        return this.width;
    }

    set height(height: number) {
        this.height = height;
    }
    get height() {
        return this.height;
    }

    updateDisplay(width: number, height: number): void {

    }
    createAxis(): void { }
    makeAxisLabel(): void { }

}
