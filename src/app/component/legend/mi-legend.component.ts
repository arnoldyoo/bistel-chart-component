import { Component, HostListener, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { LegendConfiguration } from '../../model/legend.interface';
import { SvgLegend } from '../../common/component/legend/svg-legend';
import { Legend } from '../../common/legend/legend';


@Component({
    selector: 'mi-legend',
    templateUrl: 'mi-legend.component.html',
    styles: ['legend.component.css'],
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
        console.log('ngOnInit : ', this.width, this.height);
        this.legend.updateDisplay(this.width, this.height);
    }

    ngOnChanges(value: any) {
        console.log(value);
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
        console.log('onResize : ', elem, this.width, this.height);
        if (this.legend) {
            this.legend.updateDisplay(this.width, this.height);
        }
    }

}
