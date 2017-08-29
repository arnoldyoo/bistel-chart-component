import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartBase } from './../../common/index';
import { ChartEvent, ChartEventData } from '../../common/event/index';
import { ChartConfiguration } from "../../model/chart.interface";

@Component({
    moduleId: module.id,
    selector: 'chart',
    templateUrl: 'chart.component.html',
    styles: [`
        .michart {
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
export class ChartComponent implements OnChanges {

    @Input() config: ChartConfiguration;
    @Input() set data(value: Array<any>) {
        if (this.baseChart) {
            this.baseChart.dataProvider = value;
        }
    }
    @Input() sizeChange: boolean = false;
    @Output() itemclick = new EventEmitter();
    @Output() mouseover = new EventEmitter();
    @Output() mouseout = new EventEmitter();
    @ViewChild('chart') chart_div: ElementRef;

    baseChart: ChartBase;
    chartConfig: any;
    chartSelector: string;

    constructor() {}

    ngOnChanges(value: any) {
        if (value.config.currentValue) {
            if (this.baseChart) {
                this.baseChart.clear();
            }
            this.chart_div.nativeElement.id = value.config.currentValue.chart.selector;
            this._createChart(value.config.currentValue);
            console.log(this.chart_div.nativeElement.offsetWidth, this.chart_div.nativeElement.offsetHeight);
            this._drawChart(this.chart_div.nativeElement.offsetWidth, this.chart_div.nativeElement.offsetHeight);
        }
    }

    _createChart(config: any) {
        this.baseChart = new ChartBase(config);
        this.baseChart.addEventListener(ChartEvent.ITEM_CLICK, this._itemClick);
        this.baseChart.addEventListener(ChartEvent.MOUSE_OUT, this._mouseOut);
        this.baseChart.addEventListener(ChartEvent.MOUSE_OVER, this._mouseOver);
        this.baseChart.addEventListener(ChartEvent.CREATION_COMPLETE, this._chartCreation);
    }

    _drawChart(width: number, height: number) {
        this.updateChartDisplay(width, height);
    }

    updateChartDisplay(width: number, height: number) {
        this.config.chart.size.width = width;
        this.config.chart.size.height = height;
        this.baseChart.updateDisplay(this.config.chart.size.width, this.config.chart.size.height);
    }

    _itemClick = (event: ChartEventData) => {
        if (this.config.chart.event && this.config.chart.event.itemclick) {
            this.config.chart.event.itemclick(event);
        } else {
            if (this.itemclick && this.itemclick.emit) {
                this.itemclick.emit(event);
            }
        }
    }

    _mouseOver = (event: ChartEventData) => {
        // console.log('_mouseOver', event);
        if (this.config.chart.event && this.config.chart.event.mouseover) {
            this.config.chart.event.mouseover(event);
        } else {
            if (this.mouseover && this.mouseover.emit) {
                this.mouseover.emit(event);
            }
        }
    }

    _mouseOut = (event: ChartEventData) => {
        // console.log('_mouseOut', event);
        if (this.config.chart.event && this.config.chart.event.mouseout) {
            this.config.chart.event.mouseout(event);
        } else {
            if (this.mouseout && this.mouseout.emit) {
                this.mouseout.emit(event);
            }
        }
    }

    _chartCreation = (event: ChartEventData) => {
        console.log('chart creation complate!');
    }
}
