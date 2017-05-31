import { SeriesConditions } from './../../model/chart-param.interface';
import { IDisplay } from './../i-display.interface';
import { SeriesConfiguration } from '../../model/chart-param.interface';
import { Axe } from '../../common/axis/axe';

export abstract class Series implements IDisplay {

    _width: number;
    _height: number;
    // get group element from chart-base
    _target: any;

    _color: any;

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
    _configuration: any;
    _label: any;

    constructor(seriesConfig?: SeriesConfiguration) {
        if (seriesConfig) {
            this.configuration = seriesConfig;
        }
    }

    set configuration(value: SeriesConfiguration) {
        this._configuration = value;
        if (this._configuration) {
            this._setConditions(this._configuration.condition);
        }
        if (this._configuration.target) {
            this.target = this._configuration.target;
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

    set target(value: any) {
        this._createContainer(value);
    }

    get target(): any {
        return this._target;
    }

    set color(value: any) {
        this._color = value;
    }

    get color(): any {
        return this._color;
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

    set label(value: any) {
        this._label = value;
    }

    get label(): any {
        return this._label;
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

    protected dataSetting() { }

    protected createChildren() { }

    updateDisplay(width?: number, height?: number) {
        if (this.data) {
            this.generatePosition();
        }
    }

    protected generatePosition() { }

    /*
    * title : createItem
    * description : create point item for transition. data is setting 0
    */
    protected createItem() { }

    /*
    * title : addEvent
    * description : add eventlistener of created svg element
    */
    addEvent(element: any) {
        element
        .on('click', d => {
            const cX = (d3.event.offsetX);
            const cY = (d3.event.offsetY);
            console.log('element click ==> :', d3.event);
        })
        .on('mousemove', d => {
            const cX = (d3.event.offsetX);
            const cY = (d3.event.offsetY);
            // console.log('element click ==> x :', cX, ' , y : ', cY);
        });
    }

    /*
    * title : _createContainer
    * description : first time, create group element in series class
    */
    _createContainer(seriesTarget: any) {
        this._target = seriesTarget.append('g').attr('class', this.displayName);
    }

    _setConditions(conditions: SeriesConditions) {
        this._xField = conditions.xField;
        this._yField = conditions.yField;
        this.displayName = conditions.displayName;
        // setup field name, when displayName is null.
        if (conditions.displayName) {
            this.displayName = conditions.displayName;
        } else {
            this.displayName = this._xField;
        }

        if (conditions.label.visible) {
          this.label = conditions.label;
        }
    }

}
