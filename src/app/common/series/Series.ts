import { IDisplay } from './../i-display.interface';
import { SeriesParam } from 'app/model/chart-param.interface';
import { Axe } from 'app/common/axis/axe';

export class Series implements IDisplay {

    _width: number;
    _height: number;
    // get group element from chart-base
    _target: any;

    // api private
    // _displayName will be used in class name.
    _displayName: string;
    _xField: string;
    _yField: string;
    // total data
    _dataProvider: Array<any>;
    // single data
    _data: any;
    _index: number;
    // protected
    _seriesTarget: any;
    _xAxe: Axe;
    _yAxe: Axe;
    _x: any;
    _y: any;

    constructor(seriesParam: SeriesParam) {
        this.target = seriesParam.target;
        this._xField = seriesParam.config.xField;
        this._yField = seriesParam.config.yField;
        this.displayName = seriesParam.config.displayName;
        // tslint:disable-next-line:comment-format
        // setup field name, when displayName is null.
        if (seriesParam.config.displayName) {
            this.displayName = seriesParam.config.displayName;
        } else {
            this.displayName = this._xField;
        }
        // tslint:disable-next-line:comment-format
        // create group <g> element of series.
        this._createContainer();
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

    set target(value: any) {
        this._target = value;
    }

    get target(): any {
        return this._target;
    }

    set displayName(value: string) {
        this._displayName = value;
        if (!this._displayName) {
            this._displayName = this._xField;
        }
    }

    get displayName(): string {
        return this._displayName;
    }

    set xField(value: string) {
        this._xField = value;
    }

    get xField(): string {
        return this._xField;
    }

    set yField(value: string) {
        this._yField = value;
    }

    get yField(): string {
        return this._yField;
    }

    set data(value: any) {
        this._data = value;
    }

    get data(): any {
        return this._data;
    }

    set index(value: number) {
        this._index = value;
    }

    get index(): number {
        return this._index;
    }

    set xAxe( value: Axe ) {
        this._xAxe = value;
    }

    get xAxe(): Axe {
        return this._xAxe;
    }

    set yAxe( value: Axe ) {
        this._yAxe = value;
    }

    get yAxe(): Axe {
        return this._yAxe;
    }

    set x(value: any) {
        this._x = value;
    }

    get x(): any {
        return this._x;
    }

    set y(value: any) {
        this._y = value;
    }

    get y(): any {
        return this._y;
    }

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
        this.dataSetting();
    }

    get dataProvider() {
        return this._dataProvider;
    }

    dataSetting() { }

    createChildren() { }

    updateDisplay(width?: number, height?: number) {
        if (this.data) {
            this.generatePosition();
        }
    }

    generatePosition() { }

    /*
    * title : createItem
    * description : create point item for transition. data is setting 0
    */
    createItem() {}

    /*
    * title : _createContainer
    * description : first time, create group element in series class
    */
    _createContainer() {
        if (!this._seriesTarget) {
            this._seriesTarget = this.target.append('g').attr('class', this.displayName);
        }
    }

}
