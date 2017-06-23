import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ChartBase } from './../../common/index';
import { ChartEvent } from '../../common/event/index';


@Component({
    selector: 'mi-chart',
    templateUrl: 'mi-chart.component.html',
    styles: [`
        #div_01 {
            border: 1px solid black;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            user-select: none;
        }
        path, line {
            fill: none;
            stroke: #ccc;
            shape-rendering: crispEdges;
        }
        
        .unactive {
            fill-opacity: 0.3;
        }
        
        .active {
            fill-opacity: 1;
        }

        svg:focus {
            outline: none;
        }
    `],
    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit, OnChanges {
    @Input() chartinfo: any;
    @Input() series: any;
    @Input() axis: any;
    @Input() set data(value: Array<any>) {
        if (this.baseChart) {
            this.baseChart.dataProvider = value;
        }
    }

    @Output() itemclick = new EventEmitter();
    @Output() mouseover = new EventEmitter();
    @Output() mouseout = new EventEmitter();

    baseChart: ChartBase;
    chartConfig: any;

    constructor() { }

    ngOnInit() {
        this._setChartJson(this.chartinfo, this.axis, this.series);
        this._drawChart();
        dispatchEvent(new Event('resize'));
    }

    ngOnChanges(value) {
        if (this.baseChart) {
            this.baseChart.clear();
            this.chartinfo = value.chartinfo.currentValue;
            this.axis = value.axis.currentValue;
            this.series = value.series.currentValue;
            this._setChartJson(this.chartinfo, this.axis, this.series);
            this._drawChart();
            window.dispatchEvent(new Event('resize'));

        }
    }

    _drawChart() {
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.addEventListener(ChartEvent.ITEM_CLICK, this._itemClick);
        this.baseChart.addEventListener(ChartEvent.MOUSE_OUT, this._mouseOut);
        this.baseChart.addEventListener(ChartEvent.MOUSE_OVER, this._mouseOver);
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // const elem = window.document.getElementById('div_01');
        const elem = event.target.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }

    _setChartJson(chartinfo: any, axis: any, series: any) {
        this.chartConfig = {};
        this.chartConfig.chart = chartinfo;
        this.chartConfig.axis = axis;
        this.chartConfig.series = series;
    }

    _itemClick(event: CustomEvent) {
        console.log('_itemClick', event.detail);
        if (this.itemclick && this.itemclick.emit) {
            this.itemclick.emit(event);
        }
    }

    _mouseOver(event: CustomEvent) {
        console.log('_mouseOver', event.detail);
        if (this.mouseover && this.mouseover.emit) {
            this.mouseover.emit(event);
        }
    }

    _mouseOut(event: CustomEvent) {
        console.log('_mouseOut', event.detail);
        if (this.mouseout && this.mouseout.emit) {
            this.mouseout.emit(event);
        }
    }
}
