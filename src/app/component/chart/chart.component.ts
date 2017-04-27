import { ChartBase } from './../../common/chart-base';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: 'chart.component.html'
})

export class ChartComponent implements OnInit {
    baseChart: ChartBase;
    chartConfig: any;
    constructor() { }
    ngOnInit() {
        this._setChartJson();
        this.baseChart = new ChartBase(this.chartConfig);
        this.baseChart.generateConfiguration();
        this.baseChart.updateDisplay(this.chartConfig.chart.size.width, this.chartConfig.chart.size.height);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_01');
        this.baseChart.updateDisplay(elem.offsetWidth, elem.offsetHeight);
    }
    _setChartJson(): void {
        this.chartConfig = {
            chart: {
                selector: '#div_01',
                size: {
                    width: 800,
                    height: 400
                },
                margin: {
                    left: 50,
                    right: 0,
                    top: 0,
                    bottom: 50
                }
            },
            axis: [
                {
                    dataType: 'numeric',
                    type: 'y',
                    field: 'profit',
                    format: undefined,
                    orient: 'left',
                    visible: true,
                    title: 'Profit'
                },
                {
                    dataType: 'ordinal',
                    type: 'x',
                    field: 'category',
                    format: undefined,
                    orient: 'bottom',
                    visible: true,
                    title: 'Category'
                },
                {
                    dataType: 'date',
                    type: 'x',
                    field: 'date',
                    format: undefined,
                    orient: 'top',
                    visible: true,
                    title: 'date'
                }
            ]
        }
    }
}
