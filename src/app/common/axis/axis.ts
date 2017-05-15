import { AxisParam } from './../../model/chart-param.interface';
import { Axe } from './axe';
import { IDisplay } from './../i-display.interface';

export abstract class Axis implements IDisplay {
    axe: Axe;

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
    _tickInfo: any;
    _dataProvider: Array<any>;

    // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any
    constructor(axisparams: AxisParam) {
        this.width = axisparams.width;
        this.height = axisparams.height;
        this.margin = axisparams.margin;
        this.domain = axisparams.domain;
        this._configGenerator(axisparams.config);
        this.dataProvider = axisparams.data;
        this._createContainer(axisparams.target);
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

    set tickInfo( value: any ) {
        this._tickInfo = value;
    }

    get tickInfo() {
        return this._tickInfo;
    }

    set dataProvider( value: Array<any> ) {
        this._dataProvider = value;
        if ( !this.domain ) {
            this._createDefaultDomain();
        }
    }

    get dataProvider() {
        return this._dataProvider;
    }

    updateDisplay(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._updateContainerPosition();
        this._setupAxe();
        this.makeAxisLabel();
    }

    _setupAxe() {
        this.scaleSetting();
        this.scaleToAxeSetting();
    }

    scaleToAxeSetting() { }

    scaleSetting() { }

    makeAxisLabel() { }

    _configGenerator(config: any) {
        this.field = config.field;
        this.format = config.format;
        this.visible = config.visible;
        this.title = config.title;
        this.type = config.type;
        this.orient = config.orient;
        if (config.tickInfo) {
            this.tickInfo = config.tickInfo;
        }
    }

    _createContainer(axisTarget: any) {
        this.target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
        this.updateDisplay(this.width, this.height);
    }

    _updateContainerPosition() {
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

    _createDefaultDomain() {
        this.domain = this.dataProvider.map( d => {
            return d[this.field];
        });
        if ( this.domain.length && _.isNumber(this.domain[0]) ) {
            const tempDomain = [...this.domain];
            this.domain = [];
            let min: number = _.min(tempDomain);
            // date type length 13
            if (min > 0 && min.toString().length !== 13) {
                min = 0;
            }
            const max: number = _.max(tempDomain);
            this.domain.push(min);
            this.domain.push(max);
        }
    }
}
