import { AxisParam, SeriesParam } from './../model/chart-param.interface';
import { Series } from './series/Series';
import { Axis } from './axis/axis';
import { IDisplay } from './i-display.interface';
import { InstanceLoader } from './instance-loader';

export class ChartBase implements IDisplay {

    _configuration: any;

    _target: any; // target svg element
    _width: number;
    _height: number;
    _axis: any[] = [];
    _series: any[] = [];
    _axisGroup: any; // axis group element
    _seriesGroup: any; // series group element
    _margin: any;
    _domain: any;
    _dataProvider: Array<any>;

    instance_loader: InstanceLoader;
    data: Array<any> = [];

    constructor( config?: any ) {
        this.instance_loader = new InstanceLoader();
        this.configuration = config;
        this.margin = this.configuration.chart.margin;
        this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
        this._setDefaultData();
        this._createSvgElement();
        if (config) {
            this._createComponent();
        }
    }

    set configuration( value: any ) {
        this._configuration = value;
    }

    get configuration() {
        return this._configuration;
    }

    set target( value: any ) {
        this._target = value;
    }

    get target(): any {
        return this._target;
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

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set axis( value: any[] ) {
        this._axis = value;
    }

    get axis(): any[] {
        return this._axis;
    }

    set series( value: any[] ) {
        this._series = value;
    }

    get series(): any[] {
        return this._series;
    }

    set margin( value: any ) {
        this._margin = value;
    }

    get margin() {
        return this._margin;
    }

    set domain( value: any ) {
        this._domain = value;
    }

    get domain() {
        return this._domain;
    }

    _createSvgElement() {
        this.target = this._createSvg(this.configuration.chart);
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
                              .attr('class', 'axis')
                              .attr('transform', 'translate(0 ,0)');
        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
                            .attr('class', 'series')
                            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    // generate svg element using configuration
    _createComponent() {
        this._createAxis(this.configuration.axis);
        this._createSeries(this.configuration.series);
    };

    updateDisplay(width: number, height: number)  {
        console.log(`chart-base.updateDisplay(${width}, ${height})`);
        this._setSize(width, height);
        this.target
            .attr('width', width)
            .attr('height', height);
        this._axisUpdate();
        this._seriesUpdate();
    };

    _setSize(width: number, height: number)  {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg');
    }

    _createAxis(axisList: Array<any>) {
        // tslint:disable-next-line:curly
        if (!axisList) return;
        axisList.map( axisConfig => {
            let axis: Axis;
            const axis_params: AxisParam = {
                config: axisConfig,
                target: this._axisGroup,
                width: this.width,
                height: this.height,
                margin: this.margin,
                data: this.data,
                domain: this.domain
            };

            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any
            axis = this.instance_loader.axisFactory(axisConfig.axisClass, axis_params);
            axis.updateDisplay( this.width, this.height );
            this._axis.push( axis );
        });
    }

    _createSeries(seriesList: Array<any>) {
        // tslint:disable-next-line:curly
        if (!seriesList) return;
        // series loop
        // this._series.push(seires);
        if (seriesList.length) {

            seriesList.map( seriesConfig => {
                let series: Series;
                const series_params: SeriesParam = {
                    config: seriesConfig,
                    margin: this.margin,
                    target: this._seriesGroup
                };
                series = this.instance_loader.seriesFactory(seriesConfig.seriesClass, series_params);

                // series.yAxe = _.find(this._axis, 'field', seriesConfig.yField);
                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if ( this._axis[i].field === seriesConfig.xField ) {
                        series.xAxe =  this._axis[i].axe;
                        series.xAxe.name = this._axis[i].field;
                        break;
                    }
                }

                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if ( this._axis[i].field === seriesConfig.yField ) {
                        series.yAxe =  this._axis[i].axe;
                        series.yAxe.name = this._axis[i].field;
                        break;
                    }
                }
                this._series.push(series);
            });
        }
    }

    _axisUpdate() {
        for (let i = 0 ; i < this._axis.length; i++) {
            this._axis[i].dataProvider = this.data;
            this._axis[i].updateDisplay(this.width, this.height);
        }
    }

    _seriesUpdate() {
        for (let i = 0; i < this._series.length; i++) {
            this._series[i].dataProvider = this.data;
        }
    }

    _addEvent() {};

    _setDefaultData() {
        for (let i = 0; i < 31; i++) {
            this.data.push( {  category: 'A' + i,
                           date: new Date(2017, 0, i).getTime(),
                           profit: Math.round( Math.random() * 100 ) } );
        }
    }
};
