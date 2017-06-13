import { LegendConfiguration } from '../../model/legend.interface';
export abstract class Legend {
    colors = ['#00ff00', '#00ffff', '#0000ff'];
    _orient: string;
    _series_config: Array<any>;
    _target: any;
    _configuration: LegendConfiguration;
    _container: any;

    constructor(legendConfig: LegendConfiguration) {
        this.configuration = legendConfig;
        this.series_config = this.configuration.series;
        this.orient = this.configuration.orient;
        this._createSvg();
        this._createContainer();
    }

    set series_config(value: any) {
        this._series_config = value;
        if (value.series !== undefined) {
            this._series_config = value.series;
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

    _createSvg() {
        this.target = d3.select(this.configuration.selector).append('svg');
    }

    _createContainer() {
        this.container = this.target.append('g');
    }

    protected updateDisplay() {

    }

}
