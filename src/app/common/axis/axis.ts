import { Axe } from './axe';
import { IDisplay } from './../iDisplay.interface';

export class Axis implements IDisplay {

    axe: Axe;

    _dataType: string;
    _field: string;
    _format: any;
    _visible: boolean;
    _title: string;
    _domain: Array<any>;
    _type: string;
    _orient: string;
    _margin: any;
    _target: any;
    _width: number;
    _height: number;

    constructor(config: any, axisTarget: any, width: number, height: number, margin: any) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.configGenerator(config);
        this.target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
    }

    // setter getter method
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

    set dataType( value: string ) {
        this._dataType = value;
    }
    get dataType() {
        return this._dataType;
    }

    set field( value: string ) {
        this._field = value;
    }
    get field() {
        return this._field;
    }

    set format( value: any ) {
        this._format = value;
    }
    get format() {
        return this._format;
    }

    set visible( value: boolean ) {
        this._visible = value;
    }
    get visible() {
        return this._visible;
    }

    set title( value: string ) {
        this._title = value;
    }
    get title() {
        return this._title;
    }

    set domain( value: any ) {
        this._domain = value;
    }
    get domain() {
        return this._domain;
    }

    set type( value: string ) {
        this._type = value;
    }
    get type() {
        return this._type;
    }

    set orient( value: string ) {
        this._orient = value;
    }
    get orient() {
        return this._orient;
    }

    set margin( value: any ) {
        this._margin = value;
    }
    get margin() {
        return this._margin;
    }

    updateDisplay(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.setupAxe();
        this.makeAxisLabel();
    }
    setupAxe(): void {
        // scale 정보 생성
        this.axe = new Axe(this.type, this.width, this.height, this.dataType, this.domain, this.orient);
    }

    makeAxisLabel(): void { }
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
            if ( this.dataType === 'ordinal') {
                this.domain = ['A', 'B', 'C', 'D'];
            } else if ( this.dataType === 'date' ) {
                const mindate = new Date(2017, 0, 1);
                const maxdate = new Date(2017, 0, 31);
                this.domain = [mindate, maxdate];
            } else {

            }
        } else {
            if ( this.dataType === 'ordinal') {
                this.domain = ['a', 'b', 'c', 'd'];
            } else if ( this.dataType === 'date' ) {
                const mindate = new Date(2017, 0, 1);
                const maxdate = new Date(2017, 0, 31);
                this.domain = [mindate, maxdate];
            } else {
                this.domain = [1, 100];
            }
        }
    }

}
