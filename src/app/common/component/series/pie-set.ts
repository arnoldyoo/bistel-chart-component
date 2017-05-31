import { PieSeries } from './pie-series';
import { IDisplay } from './../../i-display.interface';
import { Axe } from './../../axis/axe';
import { InstanceLoader } from './../../instance-loader';
import { SeriesConfiguration } from './../../../model/chart-param.interface';

export class PieSet implements IDisplay {

    _width: number;
    _height: number;
    _target: any;

    _series: Array<PieSeries>;
    _configuration: SeriesConfiguration;

    _dataProvider: Array<any>;
    _seriesCnt: number;
    _radius: number;

    constructor(configuration?: SeriesConfiguration) {
        if (configuration) {
            this.configuration = configuration;
        }
    }

    set configuration(value: any) {
        this._configuration = value;
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

    set radius(value: number) {
      this._radius = value;
    }

    get radius() {
      return this._radius;
    }

    set series(value: Array<PieSeries>) {
        this._series = value;
        if (this._series) {
            this._seriesCnt = this._series.length;
        }
    }
    get series(): Array<PieSeries> {
        return this._series;
    }

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
        this.radius = Math.min(this.width, this.height) / 2;
        this.updateDisplay(this.width, this.height);
    }

    get dataProvider() {
        return this._dataProvider;
    }

    updateDisplay(width?: number, height?: number) {
        const fieldSet: Array<string> = this.series.map(d => { return d.xField; });
        for ( let i = 0; i < this.series.length; i++ ) {
            this.series[i].seriesCnt = this.series.length;
            this.series[i].seriesIndex = i;
            this.series[i].width = width;
            this.series[i].height = height;
            this.series[i].xField = fieldSet[i];
            this.series[i].radius = this.radius;
            this.series[i].dataProvider = this._dataProvider;
        }
    }
}
