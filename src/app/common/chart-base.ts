import { AxisConfiguration, SeriesConditions, SeriesConfiguration } from './../model/chart-param.interface';
import { Series } from './series/Series';
import { Axis } from './axis/axis';
import { IDisplay } from './i-display.interface';
import { InstanceLoader } from './instance-loader';

export class ChartBase implements IDisplay {

    colors = ['#00ff00', '#00ffff', '#0000ff'];

    _configuration: any;

    _target: any; // target svg element
    _width: number;
    _height: number;
    _axis: any[] = [];
    _series: any[] = [];
    _axisGroup: any; // axis group element
    _seriesGroup: any; // series group element
    _backgroundGroup: any; // background element
    _gridLineGroup: any; // grid line group element
    _margin: any;
    _domain: any;
    _dataProvider: Array<any>;

    _instance_loader: InstanceLoader;
    _isStacked = false;
    data: Array<any> = [];

    min: number;
    max: number;

    constructor( config?: any ) {
        this._instance_loader = new InstanceLoader();
        this._setDefaultData();
        if (config) {
            this.configuration = config;
        }
    }

    set configuration( value: any ) {
        this._configuration = value;
        if (this._configuration) {
            this._clear();
            this.margin = this.configuration.chart.margin;
            this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
            this._createSvgElement();
            this._createComponent();
        }
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

    updateDisplay(width: number, height: number)  {
        console.log(`chart-base.updateDisplay(${width}, ${height})`);
        this._setSize(width, height);
        this.target
            .attr('width', width)
            .attr('height', height);
        this._backgroundGroup.select('.background-rect')
                             .attr('width', width - this.margin.left - this.margin.right)
                             .attr('height', height - this.margin.bottom - this.margin.top);
        this._axisUpdate();
        this._seriesUpdate();
    };

    _itemClick(event: any) {
        if (this._configuration.chart && this._configuration.chart.event) {
            if (this._configuration.chart.event.itemClick) {
                this._configuration.chart.event.itemClick(event);
            }
        }
    }

    _createSvgElement() {
        this.target = this._createSvg(this.configuration.chart)
                          .on('click', d => {
                              if (d3.event.target) {
                                  const currentEvent = {
                                      event: d3.event,
                                      data: d3.select(d3.event.target)[0][0].__data__
                                  };
                                  this._itemClick(currentEvent);
                              }
                          })
                          .on('mousemove', d => {
                              const cX = (d3.event.offsetX - this.margin.left);
                              const cY = (d3.event.offsetY - this.margin.top);
                              // console.log('background mousemove ==> x :', cX, ' , y : ', cY);
                              // console.log('background click ==> event :', d3.event);
                          })
                          .on('remove', d => {
                              console.log('this element removing');
                          });
        // create background element
        this._backgroundGroup = this.target.append('g')
                                    .attr('class', 'background')
                                    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this._backgroundGroup.append('rect')
                             .attr('class', 'background-rect')
                             .style('fill', '#ccc')
                             .style('pointer-events', 'all')
                             .style('opacity', 0)
                             ;
        // create grid line group
        // this._gridLineGroup = this.target.append('g')
        //                                  .attr('class', 'grid-line-group')
        //                                  .attr('transform', 'translate( 0, 0)');
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
                              .attr('class', 'axis')
                              .attr('transform', 'translate(0 ,0)');
        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
                                .attr('class', 'series')
                                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    // _drawGridLine() {
    //     if (this._target) {
    //         const gridGroup = this.target.select(`.grid-line-group`);
    //     }
    // }

    // generate svg element using configuration
    _createComponent() {
        // stacked check
        if (this.configuration.series) {
            this.configuration.series.map( seriesConfig => {
                const type = seriesConfig.type;
                if (type === 'stacked') { // special case
                    this._isStacked = true;
                }
            } );
        }
        this._axis = this._createAxis(this.configuration.axis);
        this._series = this._createSeries(this.configuration.series);
    };

    _setSize(width: number, height: number)  {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg');
    }

    _createAxis(axisList: Array<any>) {
        const tempList = [];
        // tslint:disable-next-line:curly
        if (!axisList) return tempList;

        axisList.map( axisConfig => {
            let axis: Axis;
            const axis_params: AxisConfiguration = {
                conditions: axisConfig,
                target: this._axisGroup,
                width: this.width,
                height: this.height,
                margin: this.margin,
                data: this.data,
                domain: this.domain,
                isStacked: this._isStacked
            };

            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any

            // case 1 : configuration
            axis = this._instance_loader.axisFactory(axisConfig.axisClass, axis_params);
            axis.updateDisplay( this.width, this.height );

            if (axis.numeric_max && axis.numeric_min) {
                this.min = axis.numeric_min;
                this.max = axis.numeric_max;
            }

            // case 2 : properties
            // axis = this._instance_loader.axisFactory(axisConfig.axisClass, null);
            // axis.configuration = axis_params;
            // axis.target = this._axisGroup;

            tempList.push(axis);
        });
        return tempList;
    }

    _createSeries(seriesList: Array<any>) {
        const tempList = [];
        // tslint:disable-next-line:curly
        if (!seriesList) return tempList;

        if (seriesList.length) {
            seriesList.map( (seriesConfig, j) => {
                let series: any;
                const type = seriesConfig.type;
                const series_configuration: SeriesConfiguration = {
                    condition: seriesConfig,
                    margin: this.margin,
                    target: this._seriesGroup,
                    type: type
                };
                series = this._instance_loader.seriesFactory(seriesConfig.seriesClass, series_configuration);
                series.color = this.colors[j];
                if (type === 'group' || type === 'stacked') { // column set series
                    series.series = this._createSeries(seriesConfig.series);
                } else {
                }
                // series.yAxe = _.find(this._axis, 'field', seriesConfig.yField);
                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if (this._axis[i].field.split(',').indexOf(seriesConfig.xField) > -1) {
                        series.xAxe =  this._axis[i].axe;
                        series.xAxe.name = this._axis[i].field;
                        break;
                    }
                }

                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if (this._axis[i].field.split(',').indexOf(seriesConfig.yField) > -1) {
                        series.yAxe =  this._axis[i].axe;
                        series.yAxe.name = this._axis[i].field;
                        break;
                    }
                }

                // case2 : property
                // series = this._instance_loader.seriesFactory(seriesConfig.seriesClass, null);
                // series.configuration = series_configuration;
                // series.target = this._seriesGroup;

                tempList.push(series);
            });
        }
        return tempList;
    }

    _axisUpdate() {
        // tslint:disable-next-line:curly
        if (!this._axis) return;
        for (let i = 0 ; i < this._axis.length; i++) {
            this._axis[i].dataProvider = this.data;
            this._axis[i].numeric_min = this.min;
            this._axis[i].numeric_max = this.max;
            this._axis[i].updateDisplay(this.width, this.height);
        }
    }

    _seriesUpdate() {
        // tslint:disable-next-line:curly
        if (!this._series) return;
        for (let i = 0; i < this._series.length; i++) {
            this._series[i].width = this.width;
            this._series[i].height = this.height;
            this._series[i].dataProvider = this.data;
        }
    }

    _clear() {
        if (this.target) {
            this.target.remove();
            this.target = null;
            this._axis = null;
            this._series = null;
        }
    }

    _addEvent() {};

    _setDefaultData() {
        for (let i = 0; i < 5; i++) {
            this.data.push( {  category: 'A' + i,
                          //  date: new Date(2017, 0, i).getTime(),
                           rate: Math.round( Math.random() * 10 ),
                           ratio: Math.round( Math.random() * 110  ),
                           revenue: Math.round( Math.random() * 120  ),
                           profit: Math.round( Math.random() * 100  ) } );
        }
    }
};
