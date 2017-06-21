import { AxisConfiguration, SeriesConfiguration } from './../model/chart-param.interface';
import { Axis } from './axis/axis';
import { IDisplay } from './i-display.interface';
import { InstanceLoader } from './instance-loader';
import { ChartException } from '../common/error/chart-exception';
import { ChartEvent } from './event/chart-event';
import { Observable } from 'rxjs/Observable';

export class ChartBase implements IDisplay {

    colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'];

    min: number;
    max: number;

    secondMin: number;
    secondMax: number;

    private _configuration: any;
    private _target: any; // target svg element
    private _width: number;
    private _height: number;
    private _axis: any[] = [];
    private _series: any[] = [];
    private _axisGroup: any; // axis group element
    private _seriesGroup: any; // series group element
    private _backgroundGroup: any; // background element
    private _dragGroup: any; // drag area element
    private _margin: any;
    private _domain: any;
    private _dataProvider: Array<any> = [];

    private _instanceLoader: InstanceLoader;
    private _isStacked = false; // special series ( data parse )
    private _eventMap: any; // chart event list
    private _manuals = ['normal', 'zoom', 'multiselection'];
    private _current_manual = this._manuals[0];

    constructor( config?: any ) {
        this._instanceLoader = new InstanceLoader();
        if (config) {
            this.configuration = config;
        }
    }

    set configuration( value: any ) {
        this._configuration = value;
        if (this._configuration) {
            if (!this._configuration.chart.data) {
                this._setDefaultData();
            } else {
                this.dataProvider = this._configuration.chart.data;
            }
            this.clear();
            this.margin = this.configuration.chart.margin;
            this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
            try {
                this._createSvgElement();
                this._createComponent();
            } catch (e) {
                console.log(e instanceof ChartException);
                console.log('Error Code : ', e.status);
                console.log('Error Message : ', e.errorContent.message);
            }
            this._addEvent();
        }
    }

    get configuration() {
        return this._configuration;
    }

    set manual(value: string) {
        const manualid = this._manuals.indexOf(value);
        if (manualid > -1) {
            this._current_manual = this._manuals[manualid];
        } else {
            throw new ChartException(500, {message: `not found manual type ${value}! Please select from ${this._manuals.toString()}`});
        }
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
        this.updateDisplay();
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set axis( value: any[] ) {
        this._axis = this._createAxis(value);
    }

    get axis(): any[] {
        return this._axis;
    }

    set series( value: any[] ) {
        this._series = this._createSeries(value);
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

    addEventListener(type: string, method: any) {
        if ( !this._eventMap ) {
            this._eventMap = {};
        }
        this._eventMap[type] = method;
    }

    dispatchEvent(type: string, event: any) {
        if (this._eventMap[type]) {
            this._eventMap[type](event);
        }
    }

    updateDisplay(width?: number, height?: number) {
        if ( width && height ) {
            this._setSize(width, height);
            this.target
                .attr('width', width)
                .attr('height', height);
            this._backgroundGroup.select('.background-rect')
                                .attr('width', width - this.margin.left - this.margin.right)
                                .attr('height', height - this.margin.bottom - this.margin.top);
        }
        try {
            this._axisUpdate();
            this._seriesUpdate();
        } catch (e) {
            console.log('Error Code : ', e.status);
            console.log('Error Message : ', e.errorContent.message);
        }
    }

    clear() {
        if (this.target) {
            this.target.remove();
            this.target = null;
            this._axis = null;
            this._series = null;
        }
    }

    _createSvgElement() {
        this.target = this._createSvg(this.configuration.chart);
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
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
                              .attr('class', 'axis')
                              .attr('transform', 'translate(0 ,0)');
        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
                                .attr('class', 'series')
                                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this._dragGroup = this.target.append('g')
                              .attr('class', 'draging')
                              .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

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
        this.axis = this.configuration.axis;
        this.series = this.configuration.series;
    };

    _setSize(width: number, height: number)  {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg').attr('id', this.configuration.chart.uid);
    }

    _createAxis(axisList: Array<any>) {
        const tempList = [];
        // tslint:disable-next-line:curly
        if (!axisList) return tempList;

        axisList.map( axisConfig => {
            let axis: Axis;
            const axis_params: AxisConfiguration = {
                conditions: axisConfig,
                // target: this._axisGroup,
                width: this.width,
                height: this.height,
                margin: this.margin,
                data: this.dataProvider,
                domain: this.domain,
                isStacked: this._isStacked
            };

            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any

            // case 1 : configuration
            // axis = this.__instanceLoader.axisFactory(axisConfig.axisClass, axis_params);

            // case 2 : properties
            axis = this._instanceLoader.axisFactory(axisConfig.axisClass, null);
            axis.configuration = axis_params;
            axis.target = this._axisGroup;

            axis.updateDisplay( this.width, this.height );

            if (axis.numeric_max && axis.numeric_min) {
                this.min = axis.numeric_min;
                this.max = axis.numeric_max;
            }

            tempList.push(axis);
        });

        return tempList;
    }

    _createSeries(seriesList: Array<any>) {
        const tempList = [];

        if (!seriesList) return tempList;

        if (seriesList.length) {
            seriesList.map( (seriesConfig, j) => {
                let series: any;
                const type = seriesConfig.type;
                const series_configuration: SeriesConfiguration = {
                    condition: seriesConfig,
                    margin: this.margin,
                    // target: this._seriesGroup,
                    type: type
                };

                // case1 : configuration
                // series = this.__instanceLoader.seriesFactory(seriesConfig.seriesClass, series_configuration);

                // case2 : property
                series = this._instanceLoader.seriesFactory(seriesConfig.seriesClass, null);
                series.configuration = series_configuration;
                series.target = this._seriesGroup;

                series.color = this.colors[j];
                if (type === 'group' || type === 'stacked') { // column set series
                    series.series = this._createSeries(seriesConfig.series);
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

                tempList.push(series);
            });
        }
        return tempList;
    }

    _axisUpdate() {
        // tslint:disable-next-line:curly
        if (!this._axis) return;
        for (let i = 0 ; i < this._axis.length; i++) {
            this._axis[i].dataProvider = this.dataProvider;
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
            this._series[i].dataProvider = this.dataProvider;
        }
    }

    _addEvent() {
        console.log('_addEvent : ', this.target);
        this.target.on('click', d => {
            if (d3.event.target) {
                const currentEvent: ChartEvent = new ChartEvent(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);

                if (currentEvent.data === undefined) {
                    this.series.map((s) => {
                        s.unselectAll();
                    });
                }
                this.dispatchEvent(ChartEvent.ITEM_CLICK, currentEvent);
            }
        })
        .on('mouseover', d => {
            if (d3.event.target) {
                const currentEvent: ChartEvent = new ChartEvent(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);
                this.dispatchEvent(ChartEvent.MOUSE_OVER, currentEvent);
            }
        })
        .on('mouseout', d => {
            if (d3.event.target) {
                const currentEvent: ChartEvent = new ChartEvent(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);
                this.dispatchEvent(ChartEvent.MOUSE_OUT, currentEvent);
            }
        })
        .on('mousemove', d => {
            const cX = (d3.event.offsetX - this.margin.left);
            const cY = (d3.event.offsetY - this.margin.top);
            // console.log('background mousemove ==> x :', cX, ' , y : ', cY);
            // console.log('background click ==> event :', d3.event);
        })
        .on('remove', d => {
            // this._itemClick(currentEvent);
        });

        const mouseDowns = Observable.fromEvent(this.target[0][0], 'mousedown');
        const mouseUps = Observable.fromEvent(this.target[0][0], 'mouseup');
        const mouseMoves = Observable.fromEvent(this.target[0][0], 'mousemove');

        const keybind = Observable.fromEvent(d3.select('body')[0][0], 'keydown');
        keybind.subscribe( (e: any) => {
            console.log(e.keyCode);
        });

        let offsetX = 0; // start x
        let offsetY = 0; // start y
        let moveX = 0;
        let moveY = 0;

        mouseDowns.map(function () {
            return mouseMoves.takeUntil(mouseUps);
        })
        .concatAll()
        .subscribe( (e: any) => {
            const leftp = e.x - offsetX + 'px';
            const topp = e.y - offsetY + 'px';
            // console.log( 'left: ', leftp, 'top:', topp );
        });

        mouseDowns.subscribe( (e: any) => {
            offsetX = e.offsetX - this.margin.top + 1;
            offsetY = e.offsetY - this.margin.left + 1;
            console.log( 'mouseDowns x: ', offsetX, 'y:', offsetY );
        });

        mouseUps.subscribe( (e: any) => {
            moveX = e.offsetX - this.margin.top - 1;
            moveY = e.offsetY - this.margin.left - 1;
            this._afterEvent();
            console.log( 'mouseUps x: ', moveX, 'y:', moveY );
        });

    };

    _afterEvent() {
        switch (this._current_manual) {
            case 'selection' :
                this._dragSelection();
                break;
            case 'zoom' :
                this._zoomSelection();
                break;
            default :
                this._move();
                break;
        }
    }

    _dragSelection() {

    }

    _zoomSelection() {

    }

    _move() {

    }

    _setDefaultData() {
        const testdata = [];
        for (let i = 0; i < 20; i++) {
            testdata.push( {  category: 'A' + i,
                           date: new Date(2017, 0, i).getTime(),
                           rate: Math.round( Math.random() * 10 ),
                           ratio: Math.round( Math.random() * 110  ),
                           revenue: Math.round( Math.random() * 120  ),
                           profit: Math.round( Math.random() * 100  ) } );
        }
        this.dataProvider = testdata;
    }
}
