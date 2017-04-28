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
    _target: any;  // svg group element value
    _width: number;
    _height: number;

    constructor(config: any, axisTarget: any, width: number, height: number, margin: any, domain: any) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.domain = domain;
        this._configGenerator(config);
        this._createContainer(axisTarget);
    }

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
        this._updateContainerPosition();
        this._setupAxe();
        this.makeAxisLabel();
    }
    _setupAxe(): void {
        this.scaleSetting();
        this.scaleToAxeSetting();
    }

    scaleToAxeSetting(): void { }

    scaleSetting(): void { }

    makeAxisLabel(): void { }

    _configGenerator(config: any): void {
        this.dataType = config.dataType;
        this.field = config.field;
        this.format = config.format;
        this.visible = config.visible;
        this.title = config.title;
        this.type = config.type;
        this.orient = config.orient;
    }

    _createContainer(axisTarget: any): void {
        this.target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
        this.updateDisplay(this.width, this.height);
    }

    _updateContainerPosition(): void {
        if (this.orient === 'bottom') {
            this.target.attr('transform', `translate(${this.margin.left}, ${this.height+this.margin.top})`);
        } else if (this.orient === 'top' ) {
            this.target.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        } else if (this.orient === 'right') {
            this.target.attr('transform', `translate(${this.width}, 0)`);
        } else {
            this.target.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        }
    }
}
