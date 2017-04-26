import { YAxis } from './axis/yAxis';
import { XAxis } from './axis/xAxis';
import { Axis } from './axis/axis';
import { IDisplay } from './iDisplay.interface';

export class ChartBase implements IDisplay {

    configuration: any;

    // target svg element
    _target: any;
    _width: number;
    _height: number;
    // axis 는 orient string type으로 key :value로 저장한다.
    // 예 : 'top': xaxis, 'left': yaxis
    // 가져올 때 : return _axis['left']

    _axis: any[] = [];
    _series: any[] = [];
    _axisGroup: any;
    _seriesGroup: any;

    constructor( config: any ) {
        this.configuration = config;
        this.width = this.configuration.chart.size.width;
        this.height = this.configuration.chart.size.height;
    }

    // IDisplay interface getter setter
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

    // getter setter methods
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
        this.target
            .attr('width', width )
            .attr('height', height );

        // _axis[], _series[] loop 돌면서 update
    };

    _addEvent(): void { };

    _createSvg(chartConfig: any): void {
        return d3.select(chartConfig.selector).append('svg');
    }
    _createAxis(): void {
        // config axis loop
        this.configuration.axis.map(axis => {
            let axe: Axis;
            if (axis.type === 'x') {
                axe = new XAxis(axis, this._axisGroup, this.width, this.height);
            } else {
                axe = new YAxis(axis, this._axisGroup, this.width, this.height);
            }
            axe.updateDisplay(this.width, this.height);
            this._axis.push(axe);
        });
    }
    _createSeries(): void {
        // series loop
        // this._series.push(seires);
    }
};
