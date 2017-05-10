import { AxisParam } from './../model/ChartParam.interface';
import { NumericAxis } from './axis/NumericAxis';
import { DateTimeAxis } from './axis/DateTimeAxis';
import { CategoryAxis } from './axis/CategoryAxis';
import { Axis } from './axis/axis';
import { IDisplay } from './iDisplay.interface';
import { InstanceLoader } from './InstanceLoader';

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

    instance_loader: InstanceLoader;
    data: Array<any>;

    constructor( config: any ) {
        this.instance_loader = new InstanceLoader();
        this.configuration = config;
        this.margin = this.configuration.chart.margin;
        this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
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

    };
    get dataProvider() {
        return <any>[];
    };

    set axis( value: any[] ) {
        this._axis = value;
    };
    get axis(): any[] {
        return this._axis;
    };

    set series( value: any[] ) {
        this._series = value;
    };
    get series(): any[] {
        return this._series;
    };

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

    // generate svg element using configuration
    generateConfiguration(): void {
        this.target = this._createSvg(this.configuration.chart);
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
                              .attr('class', 'axis')
                              .attr('transform', 'translate(0 ,0)');
        this._createAxis();
        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
                            .attr('class', 'series')
                            .attr('transform', 'translate( 0, 0 )');
        this._createSeries();
    };

    updateDisplay( width: number, height: number ): void {
        this._setSize(width, height);
        this.target
            .attr('width', width)
            .attr('height', height);

        for (let i = 0 ; i < this._axis.length; i++) {
            this._axis[i].updateDisplay(this.width, this.height);
        }
    };

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg');
    }

    _createAxis(): void {
        this.configuration.axis.map( axisConfig => {
            let axe: any;
            if ( axisConfig.domain ) {
                this.domain = axisConfig.domain;
            } else {
                this._defaultDomain( axisConfig );
            }
            const axis_params: AxisParam = {
                config: axisConfig,
                target: this._axisGroup,
                width: this.width,
                height: this.height,
                margin: this.margin,
                domain: this.domain
            }
            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any
            axe = this.instance_loader.axisFactory(axisConfig.axisClass, axis_params);
            axe.updateDisplay( this.width, this.height );
            this._axis.push( axe );
        });
    }

    _createSeries(): void {
        // series loop
        // this._series.push(seires);
    }

    _setSize(width: number, height: number): void {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _defaultDomain(axisConfig: any): void {
        if ( axisConfig.type === 'x') {
            if ( axisConfig.axisClass === 'CategoryAxis') {
                this.domain = ['A', 'B', 'C', 'D'];
            } else if ( axisConfig.axisClass === 'DateTimeAxis' ) {
                const mindate = new Date(2017, 0, 1);
                const maxdate = new Date(2017, 0, 31);
                this.domain = [mindate, maxdate];
            } else {
                this.domain = [1, 100];
            }
        } else {
            if ( axisConfig.axisClass === 'CategoryAxis') {
                this.domain = ['a', 'b', 'c', 'd'];
            } else if ( axisConfig.axisClass === 'DateTimeAxis' ) {
                const mindate = new Date(2017, 0, 1);
                const maxdate = new Date(2017, 0, 31);
                this.domain = [mindate, maxdate];
            } else {
                this.domain = [1, 100];
            }
        }
    }

    _addEvent(): void { };
};
