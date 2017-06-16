import { ChartBase } from './../../common/chart-base';
import { Component, HostListener, Input, Output, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: 'chart.component.html',
    styles: [`
        #div_01 {
            border: 1px solid black;
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
    `],
    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit {
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
        this._setChartJson();
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.addEventListener(ChartBase.ITEM_CLICK, this._itemClick);
        this.baseChart.addEventListener(ChartBase.MOUSE_OUT, this._mouseOut);
        this.baseChart.addEventListener(ChartBase.MOUSE_OVER, this._mouseOver);
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
        window.dispatchEvent(new Event('resize'));
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }

    _setChartJson() {
        this.chartConfig = {};
        this.chartConfig.chart = this.chartinfo;
        this.chartConfig.axis = this.axis;
        this.chartConfig.series = this.series;
    }

    _itemClick(event: any) {
        console.log('itemClick : ', event);


        const targetEl = d3.select(event.event.target);
        if (event.data !== undefined) {
            if (typeof(event.data) === 'object') {



            } else {
                console.log('axis');
            }
        }

        this.itemclick.emit(event);
    }

    _mouseOver(event: any) {
        console.log('_mouseOver : ', event);
        this.mouseover.emit(event);
    }

    _mouseOut(event: any) {
        console.log('_mouseOut : ', event);
        this.mouseout.emit(event);
    }
}
