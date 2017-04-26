import { Axe } from './axe';
import { IDisplay } from './../iDisplay.interface';

export class Axis implements IDisplay {

    dataType: string;
    field: string;
    format: any;
    visible: boolean;
    title: string;
    domain: Array<any>;
    type: string;
    axe: Axe;
    orient: string;

    _target: any;
    _width: number;
    _height: number;

    axis: any;

    constructor(config: any, axisTarget: any, width: number, height: number) {
        this.target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
        this.width = width;
        this.height = height;
        this.configGenerator(config);
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
        this.setupAxe();
        this.makeAxisLabel();
    }
    setupAxe(): void {
        // scale 정보 생성
        this.axe = new Axe(this.type, this.width, this.height, this.dataType, this.domain, this.orient);
    }
    makeAxisLabel(): void {

    }
    configGenerator(config: any): void {
        this.dataType = config.dataType;
        this.field = config.field;
        this.format = config.format;
        this.visible = config.visible;
        this.title = config.title;
        this.type = config.type;
        this.orient = config.orient;

        if (config.domain) {
            this.domain = config.domain;
        } else {
            this._defaultDomain();
        }
    }
    _defaultDomain(): void {
        if ( this.type === 'x') {
            this.domain = ['A', 'B', 'C', 'D'];
        } else {
            this.domain = [1, 100];
        }
    }

}
