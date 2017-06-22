import { Component, HostListener, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { LegendConfiguration } from '../../model/index';
import { Legend, SvgLegend } from '../../common/index';



@Component({
    selector: 'mi-legend',
    templateUrl: 'mi-legend.component.html',
    styles: ['mi-legend.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LegendComponent implements OnInit, OnChanges {
    @Input() legendinfo: LegendConfiguration;
    @Input() chartSelector: string;
    legend: Legend;
    width = 50;
    height = 50;
    constructor() {
    }
    ngOnInit() {
        this.legend = new SvgLegend(this.legendinfo, this.chartSelector);
        this.legend.updateDisplay(this.width, this.height);
    }

    ngOnChanges(value: any) {
        if (this.legend) {
            this.legend.target.remove();
            this.legend = new SvgLegend(value.legendinfo.currentValue, this.chartSelector);
            this.legend.updateDisplay(this.width, this.height);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const elem = window.document.getElementById('div_02');
        this.width = elem.offsetWidth;
        this.height = elem.offsetHeight;
        if (this.legend) {
            this.legend.updateDisplay(this.width, this.height);
        }
    }

}
