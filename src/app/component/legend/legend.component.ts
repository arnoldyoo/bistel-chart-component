import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LegendConfiguration } from '../../model/legend.interface';
import { SvgLegend } from '../../common/component/legend/svg-legend';
import { Legend } from '../../common/legend/legend';


@Component({
    selector: 'app-legend',
    templateUrl: 'legend.component.html',
    styles: ['legend.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LegendComponent implements OnInit {
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
