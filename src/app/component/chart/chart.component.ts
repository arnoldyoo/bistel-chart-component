import { ChartBase } from './../../common/chart-base';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'app-chart',
    templateUrl: 'chart.component.html'
})

export class ChartComponent implements OnInit {
    baseChart: ChartBase;
    constructor() { }
    ngOnInit() {
        this.baseChart = new ChartBase({
            chart: {
                selector: '#div_01',
                size: {
                    width: 300,
                    height: 300
                }
            },
            axis: [
                {
                    data_type: 'ordinal',
                    axe: 'x',
                    field: 'category',
                    format: undefined,
                    orient: 'bottom',
                    visible: true,
                    title: 'Category'
                },
                {
                    data_type: 'numeric',
                    axe: 'y',
                    field: 'profit',
                    format: undefined,
                    orient: 'left',
                    visible: true,
                    title: 'Profit'
                }
            ]
        });
        this.baseChart.generateConfiguration();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.baseChart.updateDisplay(event.target.innerWidth, event.target.innerHeight);
    }
}
