import { YAxis } from './axis/yAxis';
import { XAxis } from './axis/xAxis';
import { Axis } from './axis/axis';
import { IDisplay } from './iDisplay.interface';

export class ChartBase implements IDisplay {
    // chart configuration object
    _configuration: any;
    // target svg element
    _target: any;
    // size
    _width: number;
    _height: number;
    // axis list
    _axis: any[] = [];
    // series list
    _series: any[] = [];
    // axis group element
    _axisGroup: any;
    // series group element
    _seriesGroup: any;
    // margin object
    _margin: any;

    constructor( config: any ) {
        this.configuration = config;
        this.margin = this.configuration.chart.margin;
        this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
    }

    // getter setter methods
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

    // generate svg element using configuration
    generateConfiguration(): void {
        this.target = this._createSvg(this.configuration.chart);
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
                              .attr('class', 'axis')
                              .attr('transform', 'translate(0 ,0)');
        this._createAxis();
        // this._axisGroup = this.target.select('.x.axis')[0];

        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
                            .attr('class', 'series')
                            .attr('transform', 'translate( 0, 0 )');
        this._createSeries();
    };

    // iDisplay interface method
    updateDisplay(width: number, height: number): void {
        this._setSize(width, height);
        this.target
            .attr('width', width)
            .attr('height', height);
        // _axis[], _series[] loop 돌면서 update
        // this._axis.map(function(axe) {
        //     axe.updateDisplay(this.width, this.height);
        // });
        for (let i = 0 ; i < this._axis.length; i++) {
            this._axis[i].updateDisplay(this.width, this.height);
        }
    };

    _createSvg(chartConfig: any): void {
        return d3.select(chartConfig.selector).append('svg');
    }
    _createAxis(): void {
        // config axis loop
        this.configuration.axis.map(axis => {
            let axe: Axis;
            if (axis.type === 'x') {
                axe = new XAxis(axis, this._axisGroup, this.width, this.height, this.margin);
            } else {
                axe = new YAxis(axis, this._axisGroup, this.width, this.height, this.margin);
            }
            axe.updateDisplay(this.width, this.height);
            this._axis.push(axe);
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
    _addEvent(): void { };
};
