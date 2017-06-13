import { ChartBase } from './../../common/chart-base';
import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';

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
    `],
    encapsulation: ViewEncapsulation.None
})

export class ChartComponent implements OnInit {
    @Input() chartinfo: any;
    @Input() series: any;
    @Input() axis: any;
    baseChart: ChartBase;
    chartConfig: any;

    constructor() { }

    ngOnInit() {
        this._setChartJson();
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
        window.dispatchEvent(new Event('resize'));
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }

    // chartItemClick(event: any) {
    //     this.currentData = event.data;
    //     console.log('chartItemClick : ', this.currentData);
    // }

    _setChartJson() {
        this.chartConfig = {};
        this.chartConfig.chart = this.chartinfo;
        this.chartConfig.axis = this.axis;
        this.chartConfig.series = this.series;
    }
}
