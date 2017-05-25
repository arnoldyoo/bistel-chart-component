import { BarSeries } from './bar-series';
import { IDisplay } from './../../i-display.interface';
import { Axe } from './../../axis/axe';
import { InstanceLoader } from './../../instance-loader';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class BarSet implements IDisplay {

    _width: number;
    _height: number;
    _target: any;

    _series: Array<BarSeries>;
    _type: string;
    _configuration: SeriesConfiguration;

    _dataProvider: Array<any>;
    _xAxe: Axe;
    _yAxe: Axe;
    _x: any;
    _y: any;

    _seriesCnt: number;

    constructor(configuration?: SeriesConfiguration) {
        if (configuration) {
            this.configuration = configuration;
        }
    }

    set configuration(value: any) {
        this._configuration = value;
        if (this._configuration) {
            this.type = this._configuration.type;
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
        this._target = value;
    }

    get target(): any {
        return this._target;
    }

    set series(value: Array<BarSeries>) {
        this._series = value;
        if (this._series) {
            this._seriesCnt = this._series.length;
        }
    }
    get series(): Array<BarSeries> {
        return this._series;
    }

    set type(value: string) {
        this._type = value;
        console.log('set type : ', this._type);
    }

    get type(): string {
        return this._type;
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
        this.updateDisplay(this.width, this.height);
    }

    get dataProvider() {
        return this._dataProvider;
    }

    updateDisplay(width?: number, height?: number) {
        const fieldSet: Array<string> = this.series.map(d => { return d.xField; });
        console.log(`ColumnSet ===> total field ${fieldSet}`);
        for ( let i = 0; i < this.series.length; i++ ) {
            this.series[i].seriesCnt = this.series.length;
            this.series[i].seriesIndex = i;
            this.series[i].type = this.type;
            this.series[i].stackField = fieldSet;
            this.series[i].dataProvider = this._dataProvider;
        }
    }
}
