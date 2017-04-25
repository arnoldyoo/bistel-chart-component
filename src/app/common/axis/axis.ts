import { Axe } from './axe';
import { IDisplay } from './../iDisplay.interface';

export class Axis implements IDisplay {

    dataType: string;
    field: string;
    format: any;
    visible: boolean;
    title: string;
    domain: Array<any>;
    axe: Axe;

    _target: any;
    _width: number;
    _height: number;

    constructor() {

    }

    // IDisplay interface getter setter
    set target( value: any ) {
        this._target = value;
    }
    get target(): any {
        return this._target;
    }

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
        this.setupAxe({});
        this.makeAxisLabel();
    }
    setupAxe(axisConfig: any): void {
        
        if (x) {
            this.axe = new Axe();
            // 1. scale 정보 세팅
            // 2. Axe 생성 x 인지 y인지에 따라 달라서
            
        }else {

        }
    }
    makeAxisLabel(): void {

    }

}
