import { LegendConfiguration } from '../../model/legend.interface';
import { IDisplay } from './../i-display.interface';

export abstract class Legend implements IDisplay {
    colors = ['#00ff00', '#00ffff', '#0000ff'];
    _orient: string;
    _series_config: Array<any>;
    _target: any;
    _configuration: LegendConfiguration;
    _container: any;
    _width: number;
    _height: number;

    constructor(legendConfig: LegendConfiguration) {
        this.configuration = legendConfig;
        this.series_config = this.configuration.series;
        this.orient = this.configuration.orient;
        this._createSvg();
        this._createContainer();
    }

    set series_config(value: any) {
        console.log('series_config : ', value);
        this._series_config = value[0];
        if (value[0].series.length !== 0) {
            this._series_config = value[0].series;
        }
    }

    get series_config() {
        return this._series_config;
    }

    set orient(value: string) {
        this._orient = value;
    }

    get orient() {
        return this._orient;
    }

    set target(value: any) {
        this._target = value;
    }

    get target() {
        return this._target;
    }

    set configuration(value: any) {
        this._configuration = value;
        console.log('configuration : ', this._configuration);
    }

    get configuration() {
        return this._configuration;
    }

    set container(value: any) {
        this._container = value;
    }

    get container() {
        return this._container;
    }

    set width( value: number ) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height( value: number ) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    _createSvg() {
        this.target = d3.select(this.configuration.selector).append('svg');
    }

    _createContainer() {
        this.container = this.target.append('g');
    }

    updateDisplay(width: number, height: number) {
        console.log(`legend class => updateDisplay(${width}, ${height})`);
        this.width = width;
        this.height = height;
        this.target
            .attr('width', width)
            .attr('height', height);
    }

}
