import { AxisConfiguration, SeriesConfiguration } from './../model/index';
import { Axis } from './axis/index';
import { IDisplay } from './i-display.interface';
import { InstanceLoader } from './instance-loader';
import { ChartException } from '../common/error/index';
import { ChartEvent, ChartEventData, EventMap } from './event/index';
import { Series } from './series/index';
import { DragBase } from './plugin/index';

export class ChartBase implements IDisplay {

    colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'];

    min: number;
    max: number;
    selectedItem: Array<ChartEventData> = [];

    private _configuration: any;
    private _target: any; // target svg element
    private _width: number;
    private _height: number;
    private _axis: any[] = [];
    private _series: any[] = [];
    private _plugins: any[] = [];
    private _axisGroup: any; // axis group element
    private _seriesGroup: any; // series group element
    private _backgroundGroup: any; // background element
    private _dragGroup: any; // drag area element
    private _margin: any;
    private _domain: any;
    private _dataProvider: Array<any> = [];
    private _instanceLoader: InstanceLoader;
    private _isStacked = false; // special series ( data parse )
    private _eventMap: EventMap = {}; // chart event list
    private _manuals = ['normal', 'zoom', 'multiselection'];
    private _current_manual = this._manuals[0];
    private OSName = 'none';
    private _isCtrlKey: boolean;


    private _dragEvent: DragBase;

    constructor( config?: any ) {
        this._instanceLoader = new InstanceLoader();
        if (config) {
            this.configuration = config;
            this._keyBind();
        }
    }

    set configuration( value: any ) {
        this._configuration = value;
        if (this._configuration) {
            this.manual = 'normal';
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
            this.series.map((s: Series) => {
                s.manual = this._current_manual;
            });
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

    set plugin( value: any[] ) {
        this._plugins = this._createPlugin(value);
    }

    get plugin() {
        return this._plugins;
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
        // addEventListener(type, method);
        this._eventMap[type] = method;
    }

    dispatchEvent(type: string, event: ChartEventData) {
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
            this._plugins = null;
        }
    }

    _keyBind() {
        if (navigator.appVersion.indexOf('Win') !== -1) { this.OSName = 'Win'; }
        if (navigator.appVersion.indexOf('Mac') !== -1) { this.OSName = 'Mac'; }
        if (navigator.appVersion.indexOf('X11') !== -1) { this.OSName = 'UNIX'; }
        if (navigator.appVersion.indexOf('Linux') !== -1) { this.OSName = 'Linux'; }

        const svgrect = this.target;
        svgrect.on('focus', () => {
            svgrect
                .on('keydown', () => {
                    this.manual = 'multiselection';
                    if ( this.OSName === 'Win' && d3.event.ctrlKey ) {
                        this._isCtrlKey = true;
                    } else if ( this.OSName === 'Mac' && d3.event.keyCode === 91 ) {
                        this._isCtrlKey = true;
                    } else {
                        this._isCtrlKey = false;
                    }
                })
                .on('keyup', () => {
                    this.manual = 'normal';
                });
        }, svgrect);


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
        this.plugin = this.configuration.plugin;
    };

    _setSize(width: number, height: number)  {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _createSvg(chartConfig: any): any {
        return d3.select(chartConfig.selector).append('svg').attr('id', this.configuration.chart.uid);
    }

    _createAxis(axisList: Array<any>) {
        const tempList = <any>[];
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
                data: this.dataProvider,
                domain: this.domain,
                isStacked: this._isStacked
            };

            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any

            // case 1 : configuration
            axis = this._instanceLoader.axisFactory(axisConfig.axisClass, axis_params);

            // case 2 : properties
            // axis = this._instanceLoader.axisFactory(axisConfig.axisClass, null);
            // axis.configuration = axis_params;
            // axis.target = this._axisGroup;

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
        const tempList = <any>[];

        if (!seriesList) { return tempList; }

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

                // case1 : configuration
                series = this._instanceLoader.seriesFactory(seriesConfig.seriesClass, series_configuration);

                // case2 : property
                // series = this._instanceLoader.seriesFactory(seriesConfig.seriesClass, null);
                // series.configuration = series_configuration;
                // series.target = this._seriesGroup;

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

    _createPlugin(pluginList: Array<any>) {
        const tempList = <any>[];
        if (pluginList && pluginList.length) {
            pluginList.map((plugin, i) => {
                const pluginObj = new DragBase(this.target, plugin);
                pluginObj.addEventListener(ChartEvent.PLUGIN_EVENT, this._pluginEvent);
                tempList.push(pluginObj);
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
        this.target.on('mousedown', () => {
            if (d3.event.target) {
                console.log('click');
                const currentEvent: ChartEventData = new ChartEventData(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);
                console.log(currentEvent.data);
                if (currentEvent.data === undefined) {
                    this.selectedItem = [];
                    this.series.map((s) => {
                        s.unselectAll();
                    });
                } else {
                    if (this._current_manual !== 'multiselection') {
                        this.selectedItem = [];
                    }
                    this.selectedItem.push(currentEvent);
                }
                // dispatchEvent( new CustomEvent(ChartEvent.ITEM_CLICK, { detail: currentEvent }));
                this.dispatchEvent( ChartEvent.ITEM_CLICK, currentEvent );
            }
        })
        .on('mouseover', () => {
            if (d3.event.target) {
                const currentEvent: ChartEventData = new ChartEventData(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);
                // dispatchEvent( new CustomEvent(ChartEvent.MOUSE_OVER, { detail: currentEvent }));
                this.dispatchEvent( ChartEvent.MOUSE_OVER, currentEvent );
            }
        })
        .on('mouseout', () => {
            if (d3.event.target) {
                const currentEvent: ChartEventData = new ChartEventData(
                    d3.event,
                    d3.select(d3.event.target)[0][0].__data__);
                // dispatchEvent( new CustomEvent(ChartEvent.MOUSE_OUT, { detail: currentEvent }));
                this.dispatchEvent( ChartEvent.MOUSE_OUT, currentEvent );
            }
        })
        .on('mousemove', () => {
            const cX: number = (d3.event.offsetX - this.margin.left);
            const cY: number = (d3.event.offsetY - this.margin.top);
            // console.log('move = >', cX, cY, isObj, d3.select(d3.event.target), d3.select(d3.event.target)[0][0].__data__);
        })
        .on('remove', () => {
            // this._itemClick(currentEvent);
        });

        // this.addEventListener(DragBase.DRAG_END, this._dragEnd);
    };

    _pluginEvent = (event: ChartEventData) => {
        console.log('_pluginEvent : ', event, this);
        if (event.type === ChartEvent.DRAG_END) {
            this._dragEnd(event);
        }
    };

    _dragEnd(event: any) {
        const position: any = event.data;
        // dispatchEvent(new CustomEvent(ChartEvent.SELECT_ALL_ITEMS, event));
        console.log('_dragEnd', position.startX, position.startY, position.endX, position.endY);
        this.series.map( (d) => {
            <Series>d.selectAll(position);
        });
    }

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
        const testData: Array<any> = [];
        for (let i = 0; i < 20; i++) {
            testData.push( {  category: 'A' + i,
                           date: new Date(2017, 0, i).getTime(),
                           rate: Math.round( Math.random() * 10 ),
                           ratio: Math.round( Math.random() * 110  ),
                           revenue: Math.round( Math.random() * 120  ),
                           profit: Math.round( Math.random() * 100  ) } );
        }
        this.dataProvider = testData;
    }
}
